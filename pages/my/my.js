// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showlogin:false,
    avatarUrl:'',//用户头像
    nickName:'', //用户昵称
    flag:1 //1表示普通用户2表示网店
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  onShow(){
    // 用户信息
    let {userInfo: { user: { userId} } } = app.globalData;
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
          flag:res.user.type
        })
      
      }
    })
  },
  goMyShop() {
    wx.navigateTo({
      url: '../myShop/myShop'
    })
  },
  goMyRebate(){
    wx.navigateTo({
      url: '../myRebate/myRebate'
    })
  },
  goMineFn(){
    wx.navigateTo({
      url: '../mine/mine'
    })
  }
})