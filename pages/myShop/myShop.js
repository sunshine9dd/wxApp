// pages/myShop/myShop.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showlogin: false,
    shopOwnerName:'',//店主姓名
    shopName:'',//店铺名称
    shopAddress:'',//店铺地址
    businessScope:'',//店铺经营范围
    shopOwnerPhone:'',//店主手机号
    shopImageUrl:'../../assets/img/commdefault.png'//店铺封面图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let { userInfo: { user: { userId } } } = app.globalData;
    let _this = this;
    app.wxRequestFn({
      method: 'get'
      , url: '/user/findShopById'
      , data: {
        id: userId
      }
    }, res => {
      if (res) {
        _this.setData({
          shopOwnerName: res.shop.shopOwnerName,//店主姓名
          shopName: res.shop.shopName,//店铺名称
          shopAddress: res.shop.shopAddress,//店铺地址
          businessScope: res.shop.businessScope,//店铺经营范围
          shopOwnerPhone: res.shop.shopOwnerPhone,//店主手机号
          shopImageUrl: res.shop.shopImageUrl//店铺封面图
        })
      }
    })
  }
})
