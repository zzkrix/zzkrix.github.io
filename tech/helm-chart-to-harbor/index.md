# 将 helm chart 推送到 harbor


将 helm chart 推送到指定的仓库下，默认会推送到"library"下的“helm chart“

```bash
$ helm repo add --ca-file ca.crt --username=admin myrepo https://<harbor-domain>/chartrepo/artifacts

$ helm repo list
NAME      URL
myrepo    https://harbor.local.com/chartrepo/artifacts

$ helm plugin install https://github.com/chartmuseum/helm-push

$ helm cm-push --ca-file ca.crt airflow-8.8.0.tgz myrepo
```

效果：
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20240105150137144.png)

