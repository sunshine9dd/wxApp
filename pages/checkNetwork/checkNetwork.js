// pages/checkNetwork/checkNetwork.js
const app = getApp()

Page({
  data: {
    noNetwork: false
  },
  onLoad() {
    this.refreshFn()
  },
  refreshFn() { // 刷新
    const _this = this
    app.getUserInfoFn(d => {
      _this.setData({
        noNetwork: d
      })
    }) // 获取微信用户信息，查看是否授权
  }
})