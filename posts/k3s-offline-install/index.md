# 离线部署 k3s 集群


## 环境初始化

### 参考文档

k3s 离线部署：[https://docs.k3s.io/zh/installation/airgap](https://docs.k3s.io/zh/installation/airgap)

kube-vip：[https://kube-vip.io/docs/usage/k3s/](https://kube-vip.io/docs/usage/k3s/)

### 部署环境

```bash
# 需要使用 hostnamectl set-hostname xxx 对所有机器修改主机名

# 3 台 server
172.16.99.11 server01
172.16.99.12 server02
172.16.99.13 server03

# 3 台 agent
172.16.99.14 agent01
172.16.99.15 agent02
172.16.99.16 agent03
```

准备一个和 server 同网段且空闲的虚拟 IP 给 kube-vip，本文档以 `172.16.99.100` 为例。

> kube-vip 是为了能用一个固定的虚拟 IP 充当负载均衡器来访问集群，提高集群的可用性
>
> 这个虚拟 IP 在初始化 server 和 agent 的时候都要用，会添加到三台 server 的 lo 接口
>
> 最终安装完后的效果
> ![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231229182703110.png)

## 开始安装

### 安装初始化

一、准备离线文件

从[https://github.com/k3s-io/k3s/releases](https://github.com/k3s-io/k3s/releases)下载 k3s 镜像包和 k3s 二进制文件。

版本无所谓，选最新的就行，推荐选择 `.tar.zst` 的 （压缩率高）。

二、初始化所有的 agent 和 server

> 将下载的 k3s 二进制文件放到/usr/local/bin，并且加可执行权限  chmod +x /usr/local/bin/k3s
>
> 创建目录/var/lib/rancher/k3s/agent/images/，并将下载的镜像文件放进去（不需要解压）
>
> 将安装脚本下载下来，命令 `curl -sfL https://get.k3s.io -o install.sh`

三、准备 kube-vip 镜像

在本地下载 kube-vip 镜像，并传输到所有的 `server` 机器上。

```bash
docker pull ghcr.io/kube-vip/kube-vip:v0.5.0

docker save ghcr.io/kube-vip/kube-vip:v0.5.0 -o kube-vip.tar

scp kube-vip.tar root@172.16.99.11:~
scp kube-vip.tar root@172.16.99.12:~
scp kube-vip.tar root@172.16.99.13:~
```

### 初始化 server01

> 注意修改对应的 IP 地址

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh server --cluster-init --tls-san=172.16.99.100
```

在 server01 上执行以下命令获取 token，后续安装需要用到。

```bash
cat /var/lib/rancher/k3s/server/token
```

接下来由于后面的 server 和 agent 都需要用到虚拟 IP 来进行注册，所以需要先安装 kube-vip。

### 安装 kube-vip

> 参考文档：<https://kube-vip.io/docs/usage/k3s/>

首先，导入 kube-vip 镜像。由于 k3s 默认使用的不是 docker，是 containerd，所以导入镜像的方式和 docker 有点区别，使用 ctr 命令。

> -n k8s.io // k3s 和 k8s 指定了要使用 k8s.io 这个命名空间
>
> --digests=true // 将导入的镜像中的 tag 信息一起导入进去

```bash
ctr -n k8s.io images import kube-vip.tar --digests=true
```

创建两个文件：

kube-vip-rbac.yaml

> 参考：<https://kube-vip.io/docs/usage/k3s/>

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kube-vip
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
  name: system:kube-vip-role
rules:
  - apiGroups: [""]
    resources: ["services/status"]
    verbs: ["update"]
  - apiGroups: [""]
    resources: ["services", "endpoints"]
    verbs: ["list", "get", "watch", "update"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["list", "get", "watch", "update", "patch"]
  - apiGroups: ["coordination.k8s.io"]
    resources: ["leases"]
    verbs: ["list", "get", "watch", "update", "create"]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: system:kube-vip-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:kube-vip-role
subjects:
  - kind: ServiceAccount
    name: kube-vip
    namespace: kube-system
```

kube-vip.yaml

> 参考：<https://kube-vip.io/docs/installation/daemonset/#generating-a-manifest>

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  labels:
    app.kubernetes.io/name: kube-vip-ds
    app.kubernetes.io/version: v0.5.0
  name: kube-vip-ds
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: kube-vip-ds
  template:
    metadata:
      labels:
        app.kubernetes.io/name: kube-vip-ds
        app.kubernetes.io/version: v0.5.0
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: node-role.kubernetes.io/master
                    operator: Exists
              - matchExpressions:
                  - key: node-role.kubernetes.io/control-plane
                    operator: Exists
      containers:
        - args:
            - manager
          env:
            - name: vip_arp
              value: "false"
            - name: port
              value: "6443"
            - name: vip_interface
              value: lo
            - name: vip_cidr
              value: "32"
            - name: cp_enable
              value: "true"
            - name: cp_namespace
              value: kube-system
            - name: vip_ddns
              value: "false"
            - name: svc_enable
              value: "true"
            - name: bgp_enable
              value: "true"
            - name: bgp_routerinterface
              value: "ens18"
            - name: bgp_routerid
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: bgp_as
              value: "65000"
            - name: bgp_peeraddress
            - name: bgp_peerpass
            - name: bgp_peeras
              value: "65000"
            - name: bgp_peers
              value: 172.16.99.11:65000::false,172.16.99.12:65000::false,172.16.99.13:65000::false
            - name: address
              value: 172.16.99.100
            - name: prometheus_server
              value: :2112
          image: ghcr.io/kube-vip/kube-vip:v0.5.0
          imagePullPolicy: IfNotPresent
          name: kube-vip
          resources: {}
          securityContext:
            capabilities:
              add:
                - NET_ADMIN
                - NET_RAW
      hostNetwork: true
      serviceAccountName: kube-vip
      tolerations:
        - effect: NoSchedule
          operator: Exists
        - effect: NoExecute
          operator: Exists
  updateStrategy: {}
```

其中只需要修改这一部分：
将其中 `bgp_peers` 的 `value` 中的 IP 地址换成三台 server 的地址。
`address`的`value` 是前面提到的当前网络中一个未使用的虚拟 IP 地址。

```yaml
- name: bgp_peers
  value: 172.16.99.11:65000::false,172.16.99.12:65000::false,172.16.99.13:65000::false
- name: address
  value: 172.16.99.100
```

修改后，执行部署：

```bash
kubectl apply -f kube-vip-rbac.yaml
kubectl apply -f kube-vip.yaml
```

至此，后面的机器初始化就非常简单了。

### 初始化 server02 和 server03

> 注意修改对应的 IP 地址和 token

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh server --cluster-init --tls-san=172.16.99.100 --server https://172.16.99.100:6443 --token {server01 上获取的 token}
```

导入 kube-vip 镜像

```bash
ctr -n k8s.io images import kube-vip.tar --digests=true
```

### 初始化 agent

> 注意修改对应的 IP 地址和 token

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh agent --server https://172.16.99.100:6443 --token {server01 上获取的 token}
```


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/k3s-offline-install/  

