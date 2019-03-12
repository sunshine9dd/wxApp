// pages/myRebate/myRebate.js
const app = getApp()
const utils = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profitTotalAmount:'',
    list:[],
    page:1,
    totalPageNum:1,
    pageFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { userInfo: { user: { userId } } } = app.globalData;
    let _this = this;
    app.wxRequestFn({
      method: 'get'
      , url: '/beautyProfit/findBeautyTotalProfit'
      , data: {
        userIdFk: userId
      }
    }, res => {
      if (res) {
        _this.setData({
          profitTotalAmount: res.beautyTotalProfitTable.profitTotalAmount
        })
      }
    })
    this.getList(1);
  },
  //获取数据列表
  getList(page){
    let { list, pageFlag} = this.data;
    let { userInfo: { user: { userId } } } = app.globalData;
    let _this = this;
    app.wxRequestFn({
      method: 'get'
      , url: '/beautyProfit/findBeautyProDetailListByQuery'
      , data: {
        userIdFk: userId,
        pageSize: page,
        pageNum: 10
      }
    }, res => {
      if (res) {
        if (page < res.totalPageNum){
          pageFlag = true;
        }else{
          pageFlag = false;
        }
        res.beautyProfitDetailList.forEach(function(val,ind){
          val.createDateTime = utils.formatTimeTwo(val.createDateTime, 'Y-M-D h:m:s');
          list.push(val);
        })
        _this.setData({
          list
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let { list, page, totalPageNum, pageFlag} = this.data;
    if (pageFlag && page < totalPageNum){
      page++;
      this.getList(page);
    }
  },
})