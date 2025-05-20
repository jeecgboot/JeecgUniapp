// @ts-nocheck
import { randomString } from './uitls'
import { useUserStore } from '@/store/user'

const baseUrl = import.meta.env.VITE_SERVER_BASEURL

class socket {
  constructor() {
    this.socketUrl = baseUrl
    this.socketStart = false
    this.socketType = ''
    this.monitorSocketError()
    this.monitorSocketClose()
    this.socketReceive()
  }
  init(socket_type, callback?) {
    const userStore = useUserStore()
    if (baseUrl) {
      if (this.socketStart) {
        console.log('webSocket已经启动了')
      } else {
        this.socketType = socket_type
        let url =
          this.socketUrl.replace('https://', 'wss://').replace('http://', 'ws://') +
          '/' +
          socket_type +
          '/' +
          userStore.userInfo.userid +
          '_app'
        if (socket_type == 'eoaNewChatSocket') {
          let randomMessageId = randomString(6)
          url =
            this.socketUrl.replace('https://', 'wss://').replace('http://', 'ws://') +
            '/eoaNewChatSocket/' +
            userStore.userInfo.userid +
            '/' +
            randomMessageId
        }
        console.log('启动this.socketUrl连接地址：', url)
        // update-begin-author:taoyan date:20220422 for:v2.4.6 的 websocket 服务端，存在性能和安全问题。 #3278
			
        let token = userStore.userInfo.token
        uni.connectSocket({
          url: url,
          method: 'GET',
          protocols: [token],
        })
        // update-end-author:taoyan date:20220422 for: v2.4.6 的 websocket 服务端，存在性能和安全问题。 #3278
        uni.onSocketOpen((res) => {
          this.socketStart = true
          callback && callback()
          console.log('WebSocket连接已打开！')
        })
        /* setTimeout(() => {
				   this.getHeartbeat();
				}, 5000); */
      }
    } else {
      console.log('config/baseUrl socketUrl为空')
    }
  }
  // Socket给服务器发送消息
  send(data, callback) {
    const userStore = useUserStore()
    if (userStore.userInfo.userid) {
      data.userUid = userStore.userInfo.userid
    }
    console.log(data)
    uni.sendSocketMessage({
      data: JSON.stringify(data),
      success: () => {
        callback && callback(true)
      },
      fail: () => {
        callback && callback(false)
      },
    })
  }
  acceptMessage(msg) {
    console.log(msg)
  }
  // Socket接收服务器发送过来的消息
  socketReceive() {
    uni.onSocketMessage((res) => {
      console.log('APP:--》收到服务器内容：')
      let data = JSON.parse(res.data)
      // console.log('收到服务器内容：', data);
      this.acceptMessage && this.acceptMessage(data)
    })
  }
  // 关闭Socket
  closeSocket() {
    uni.closeSocket()
    this.socketStart = false
  }
  // 监听Socket关闭
  monitorSocketClose() {
    uni.onSocketClose((res) => {
      console.log('WebSocket 已关闭！')
      this.socketStart = false
      setTimeout(() => {
        this.init(this.socketType)
      }, 3000)
    })
  }
  // 监听Socket错误
  monitorSocketError() {
    uni.onSocketError(function (res) {
      this.socketStart = false
      console.log('WebSocket连接打开失败，请检查！')
    })
  }
  // 心跳
  getHeartbeat() {
    const userStore = useUserStore()
    this.send(
      {
        type: '心跳',
        userUid: userStore.userInfo.userid,
      },
      (val) => {
        setTimeout(() => {
          if (val) {
            // this.getHeartbeat();
          } else {
            if (!this.socketStart) {
              // this.init();
            }
          }
        }, 10000)
      },
    )
  }
}
const mySocket = new socket()
export default mySocket
