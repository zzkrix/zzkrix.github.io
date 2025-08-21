# wireshark 之 sharkd 使用


## 介绍

官方接口文档：<https://wiki.wireshark.org/sharkd-JSON-RPC>

sharkd 是 wireshark 里用来解析数据包的模块，可以单独编译和使用。

sharkd 可执行文件未包含在标准 Wireshark 二进制包（Windows MSI 等）中，因此必须从源代码构建。

sharkd 提供了接口用于数据查询（使用 tcp 或本地 socket）。

发送给 sharkd 进程的请求格式为 `{"jsonrpc":"2.0","id":1, "method": "xxx"}`。
其中的 id 为非 0 的数字，表示请求序号，请求和应答根据 id 进行关联，所以请尽量保证每个请求 id 不重复。

编译：

```bash
git clone --depth=1 https://github.com/wireshark/wireshark

cd wireshark

# debian 系使用这个，其他平台在 tools 目录下找对应的文件即可
tools/debian-setup.sh

mkdir build

cd build

cmake -DBUILD_wireshark=OFF ..

make -j

# 编译出来的文件在 ./run/sharkd
```

## 使用

启动 sharkd 守护进程：

```bash
$ sharkd -a unix:/tmp/sharkd.sock

Running as user "root" and group "root". This could be dangerous.
Sharkd listening on: unix:/tmp/sharkd.sock
```

使用代码和 sharkd 交互：

```python
import socket

def get_json_bytes(json_string):
    return bytes((json_string + '\n'), 'utf-8')

def json_send_recv(s, json) -> str:
    s.sendall(get_json_bytes(json))
    data = s.recv(1024)
    return data[:].decode('utf-8')

s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
s.connect("/tmp/sharkd.sock")

json_string = '{"jsonrpc":"2.0","id":1, "method": "status"}'
print('send: ' + json_string)
rx_json = json_send_recv(s, json_string)
print('recv: ' + rx_json)

s.close()
```

让 sharkd 加载抓包文件，向 sharkd 接口发送以下内容：

```json
{ "jsonrpc": "2.0", "id": 1, "method": "load", "file": "/tmp/test.pcap" }
```

> 对 sharkd 来说，文件是一次性加载的，如果加载后文件发生变化，sharkd 并不会动态更新，所以需要开发人员给 sharkd 发送上述指令重新加载。

更多使用方法请参考[官方文档](https://wiki.wireshark.org/sharkd-JSON-RPC)。

## 其他

还有一个经常被搜到的文档，~~<https://wiki.wireshark.org/Development/sharkd>~~

应该是过时了，就不要看了，里面内容不对，很迷惑人。


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/sharkd/  

