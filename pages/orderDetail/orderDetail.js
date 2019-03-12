// pages/orderDetail/orderDetail.js
const app = getApp();
const utils = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:1,
    beautyInfoOrderTable: {},
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index: options.index,
      id: options.beautyOrderId
    })
    this.getDetail();
  },
  //获取订单详情
  getDetail(){
    let _this = this;
    let {id} = this.data;
    let { userInfo: { user: { userId, token } } } = app.globalData;
    app.wxRequestFn({
      method: 'get'
      , url: '/beautyOrder/findBeautyOrderById'
      , data: {
        userIdFk: userId,
        token: token,
        beautyOrderId: id
      }
    }, res => {
      if (res) {
        let orderDetail = res.beautyInfoOrderTable;
        if (orderDetail.orderDateTime) {
          orderDetail.orderDateTime = utils.formatTimeTwo(orderDetail.orderDateTime, 'Y-M-D h:m:s')
        }
        if (orderDetail.cancelOrderDateTime) {
          orderDetail.cancelOrderDateTime = utils.formatTimeTwo(orderDetail.cancelOrderDateTime, 'Y-M-D h:m:s')
        }
        if (orderDetail.prePayDateTime) {
          orderDetail.prePayDateTime = utils.formatTimeTwo(orderDetail.prePayDateTime, 'Y-M-D h:m:s')
        }
        if (orderDetail.dispatchDateTime) {
          orderDetail.dispatchDateTime = utils.formatTimeTwo(orderDetail.dispatchDateTime, 'Y-M-D h:m:s')
        }
        if (orderDetail.payDateTime) {
          orderDetail.payDateTime = utils.formatTimeTwo(orderDetail.payDateTime, 'Y-M-D h:m:s')
        }
        _this.setData({
          beautyInfoOrderTable: orderDetail
        })
      }
    })
  },
  //点击取消订单
  cancelFn(e) {
    let _this = this;
    let { id, index } = e.currentTarget.dataset;
    let { userInfo: { user: { userId, token } } } = app.globalData;
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      confirmColor: '#0076FF',
      success: function (res) {
        if (res.confirm) {
          app.wxRequestFn({
            method: 'get'
            , url: '/beautyOrder/cancelBeautyOrderInfo'
            , data: {
              userIdFk: userId,
              beautyOrderId: id,
              token: token
            }
          }, res => {
            if (res) {
              let pages = getCurrentPages();
              let prevPage = pages[pages.length - 2];  //上一个页面
              let beautyInfoOrderTableList = prevPage.data.beautyInfoOrderTableList //取上页data里的数据也可以修改
              beautyInfoOrderTableList.splice(index, 1)
              prevPage.setData({
                beautyInfoOrderTableList: beautyInfoOrderTableList
              })//设置数据
              wx.navigateBack({
                delta:1
              })
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  //去评价
  goAppraiseFn(e) {
    let { id, index, service } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../appraise/appraise?beautyOrderId=' + id + '&index=' + index + '&beautyServiceIdFk=' + service +'&delta=2'
    })
  },
  //预支付
  prevPayFn() {
    let _this = this;
    let { id ,index} = this.data;
    let { userInfo: { user: { openid } } } = app.globalData;
    app.wxRequestFn({
      method: 'get'
      , url: '/getPrepayIdByuserOrderId'
      , data: {
        beautyOrderId: id,
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
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];  //上一个页面
            let beautyInfoOrderTableList = prevPage.data.beautyInfoOrderTableList //取上页data里的数据也可以修改
            beautyInfoOrderTableList.splice(index, 1)
            prevPage.setData({
              beautyInfoOrderTableList: beautyInfoOrderTableList
            })//设置数据
            _this.getDetail();
          },
          'fail': function (res) {

          }
        })
      }
    })
  }
})