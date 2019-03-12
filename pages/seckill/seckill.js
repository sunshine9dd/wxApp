// pages/seckill/seckill.js
const app = getApp();
const utils = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starInfo:[],
    imgUrls:[],
    evaluationTableList:[],
    beautyServiceId:'',
    page: 1,
    pageTotal: 1,
    pageFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
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
          imgUrls: res.imageInfoList,
          beautyServiceId: options.beautyServiceId
        })
        _this.getAppraiseFn(1);
      }
    })
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom() {
    let { page, pageFlag } = this.data;
    if (pageFlag && (page < pageTotal)) {
      this.setData({
        pageFlag: false //当可以下拉加载时为true,不能继续加载时为false
      })
      this.getAppraiseFn((page + 1));
    }
  },
  //获取评论
  getAppraiseFn(num){
    let pageFlag = false;
    let {beautyServiceId } = this.data;
    app.wxRequestFn({
      method: 'get'
      , url: '/beautyEval/findEvalByQuery'
      , data: {
        beautyServiceIdFk: beautyServiceId,
        pageSize: num,
        pageNum: 10
      }
    }, res => {
      if (res) {
        let evaluationTableList = res.evaluationTableList;
        evaluationTableList.forEach(function (value, index) {
          if (value.evalutionDatetime) {
            evaluationTableList[index].evalutionDatetime = utils.formatTimeTwo(value.evalutionDatetime, 'Y-M-D h:m:s')
          }
        })
        if (num < res.totalPageNum) {
          pageFlag = true;
        }
        this.setData({
          pageFlag: pageFlag,
          page: num,
          pageTotal: res.totalPageNum,
          evaluationTableList: evaluationTableList
        })
      }
    })
  },
  goBuySecKillOrder() {
    let { starInfo: { beautyServiceId}} = this.data; 
    wx.navigateTo({
      url: '../seckillPlaceOrder/seckillPlaceOrder?beautyServiceId=' + beautyServiceId
    })
  }
})