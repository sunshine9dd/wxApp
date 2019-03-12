// pages/seckillPlaceOrder/seckillPlaceOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starInfo:[],
    nickname:'',
    phone:'',
    beautyServiceIdFk:'',
    userAddress:'',
    totalPayAmount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let { userInfo: { user: { nickname, phone } } } = app.globalData;
    app.wxRequestFn({
      method: 'get'
      , url: '/beautyService/findBeautyServiceInfoById'
      , data: {
        beautyServiceId: options.beautyServiceId
      }
    }, res => {
      if (res) {
        let arr = [];
        for (let i = 0; i < res.beautyServiceInfoTable.beautyServiceRank; i++) {
          arr.push(i);
        }
        res.beautyServiceInfoTable.beautyServiceRank = arr;
        _this.setData({
          starInfo: res.beautyServiceInfoTable,
          beautyServiceIdFk: options.beautyServiceId,
          totalPayAmount: res.beautyServiceInfoTable.totalPayAmount,
          nickname,
          phone
        })

      }
    })
  },
  //获取位置
  getAddressFn() {
    let _this = this;
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        _this.setData({
          userAddress: res.address
        })
      }
    })
  },
  //提交订单
  payFn(){
    let _this = this;
    let { beautyServiceIdFk, userAddress, totalPayAmount} = this.data;
    let { userInfo: { user: { nickname,phone,userId, token } } } = app.globalData;
    if (!userAddress){
      wx.showModal({
        title: '提示',
        content: '请选择服务地址',
        showCancel: false,
        confirmColor: '#0076FF'
      })
    }else{
      app.wxRequestFn({
        method: 'get'
        , url: '/beautyOrder/addBeautyOrderInfo'
        , data: {
          userIdFk: userId,
          userPhone: phone,
          userName: nickname,
          totalPayAmount: totalPayAmount,
          beautyServiceIdFk: beautyServiceIdFk,
          token: token,
          userAddress: userAddress
        }
      }, res => {
        if (res) {
          _this.prevPayFn(res.beautyInfoOrderTable.beautyOrderId);
        }
      })
    }
  },
  //预支付
  prevPayFn(id){
    let { userInfo: { user: { openid}  } } = app.globalData;
    console.log(openid)
    app.wxRequestFn({
      method: 'get'
      , url: '/getPrepayIdByuserOrderId'
      , data: {
        beautyOrderId:id,
        openId: openid
      }
    }, res => {
      if (res) {
        wx.requestPayment({
          'appId': res.appId,
          'timeStamp': res.timeStamp,
          'nonceStr': res.nonceStr,
          'package': res.package,
          'signType': res.signType,
          'paySign': res.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '../orderlist/orderlist?orderStatus=3'
            })
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '../orderlist/orderlist?orderStatus=1'
            })
          }
        })
      }
    })
  }
})