// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    sex:'',
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 用户信息
    let { userInfo: { user: { userId } } } = app.globalData;
    let _this = this;
    app.wxRequestFn({
      method: 'get'
      , url: '/user/findById'
      , data: {
        id: userId
      }
    }, res => {
      if (res) {
        _this.setData({
          avatarUrl: res.user.headPortraitUrl,
          nickName: res.user.nickname,
          sex: res.user.sex,
          phone: res.user.phone
        })

      }
    })
  },
  goQR(){
    wx.navigateTo({
      url: '../QR/QR'
    })
  }
})