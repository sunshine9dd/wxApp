// pages/orderlist/orderlist.js
const app = getApp();
const utils = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:1,
    beautyInfoOrderTableList:[],
    page:1,
    pageTotal:1,
    pageFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.orderStatus
    })
    this.orderListFn(1);
  },
  onShow(){
    this.setData({
      beautyInfoOrderTableList: []
    })
    this.orderListFn(1);
  },
  //下拉刷新
  onPullDownRefresh() {
    let _this = this;
    setTimeout(() => {
      wx.stopPullDownRefresh() //停止下拉动作
      _this.setData({
        beautyInfoOrderTableList:[]
      })
      _this.orderListFn(1);
    }, 500)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let { page, pageFlag} = this.data;
    if (pageFlag && (page < pageTotal)) {
      this.setData({
        pageFlag: false //当可以下拉加载时为true,不能继续加载时为false
      })
      this.orderListFn((page + 1));
    }
  },
  //获取订单列表
  orderListFn(num){
    let _this = this;
    let pageFlag = false;
    let { status} = this.data;
    let { userInfo: { user: { userId, token } } } = app.globalData;
    app.wxRequestFn({
      method: 'get'
      , url: '/beautyOrder/findOrderInfoTableByUserIdAndStatus'
      , data: {
        userIdFk: userId,
        token: token,
        orderStatus: status,
        pageSize: num,
        pageNum: 10
      }
    }, res => {
      if (res) {
        let orderList = res.beautyInfoOrderTableList;
        orderList.forEach(function(value,index){
          if (value.prePayDateTime){
            orderList[index].prePayDateTime = utils.formatTimeTwo(value.prePayDateTime, 'Y-M-D h:m:s')
          }
          if (value.payDateTime) {
            orderList[index].payDateTime = utils.formatTimeTwo(value.payDateTime, 'Y-M-D h:m:s')
          }
        })
        if (num < res.totalPageNum){
          pageFlag = true;
        }
        this.setData({
          pageFlag: pageFlag,
          page:num,
          pageTotal: res.totalPageNum,
          beautyInfoOrderTableList: res.beautyInfoOrderTableList
        })
      }
    })
  },
  // 最上方点击事件
  orderTypeFn(e) {
    let index = Number(e.target.dataset.index);
    this.setData({
      status: index,
      beautyInfoOrderTableList: [],
      page: 1,
      pageTotal: 1,
      pageFlag: false
    })
    this.orderListFn(1);
  },
  //点击取消订单
  cancelFn(e){
    let _this = this;
    let { id,index} = e.currentTarget.dataset;
    let { userInfo: { user: { userId, token } } } = app.globalData;
    let { beautyInfoOrderTableList } = this.data;
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
              beautyInfoOrderTableList.splice(index, 1)
              _this.setData({
                beautyInfoOrderTableList: beautyInfoOrderTableList
              })
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  //去订单详情
  goDetailFn(e){
    let { id, index } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?beautyOrderId=' + id+'&index='+index
    })
  },
  //去评价
  goAppraiseFn(e){
    let { id, index, service} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../appraise/appraise?beautyOrderId=' + id + '&index=' + index + '&beautyServiceIdFk=' + service +'&delta=1'
    })
  },
  //预支付
  prevPayFn(e) {
    let _this = this;
    let { status} = this.data;
    let { id,type} = e.currentTarget.dataset;
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
            if (type == '1') {
              status = 3;
            } else {
              status = 5;
            }
            _this.setData({
              beautyInfoOrderTableList: [],
              status: status
            })
            _this.orderListFn(1);
          },
          'fail': function (res) {
            
          }
        })
      }
    })
  }
    
})