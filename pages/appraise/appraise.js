// pages/appraise/appraise.js
const app = getApp();
const utils = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beautyInfoOrderTable:{},
    beautyOrderIdFk:'', //订单Id
    evalutionContent: '',//评论内容
    evalutionRank:5,//评价星星：1-5*
    solidStar:[1,2,3,4,5], //实心星星
    hollowStar:[],//空心星星
    beautyServiceIdFk:'',//美容服务主键*
    headPortraitUrl:'', //头像
    evalutionStatus: 0,//状态0正常1停用
    imageUrlList: [],//评论图片*
    nickname:'',
    userIdFk:'',
    delta:1,
    ind:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let { userInfo: { user: { nickname, userId, token, headPortraitUrl} } } = app.globalData;
    app.wxRequestFn({
      method: 'get'
      , url: '/beautyOrder/findBeautyOrderById'
      , data: {
        userIdFk: userId,
        token: token,
        beautyOrderId: options.beautyOrderId
      }
    }, res => {
      if (res) {
        this.setData({
          nickname,
          headPortraitUrl,
          userIdFk: userId,
          beautyServiceIdFk: options.beautyServiceIdFk,
          beautyOrderIdFk: options.beautyOrderId,
          beautyInfoOrderTable: res.beautyInfoOrderTable,
          delta: options.delta,
          ind: options.index
        })
      }
    })
  },
  //点击实心星星
  solidStarFn(e){
    let { index } = e.currentTarget.dataset;
    let solidStar = [], hollowStar = [];
    for(var i=1;i<=5;i++){
      if(i<=index){
        solidStar.push(i)
      }else{
        hollowStar.push(i)
      }
    }
    this.setData({
      evalutionRank: index,
      solidStar,
      hollowStar
    })
  },
  //点击空心星星
  hollowStarFn(e) {
    let { index } = e.currentTarget.dataset;
    let lon = this.data.solidStar.length;
    let solidStar = [], hollowStar = [];
    for (var i = 1; i <= 5; i++) {
      if (i <= (index + lon)) {
        solidStar.push(i)
      } else {
        hollowStar.push(i)
      }
    }
    this.setData({
      evalutionRank: (index+lon),
      solidStar,
      hollowStar
    })
  },
  //输入内容
  bindInput(e){
    this.setData({
      evalutionContent: e.detail.value
    })
  },
  //添加图片
  addImgFn(){
    let _this = this;
    let imageUrlList = this.data.imageUrlList;
    let flag = false;
    app.uploadImgFn(function (res) {  //调用七牛上传图片并返回图片链接地址
      imageUrlList.push(res);
      _this.setData({
        imageUrlList: imageUrlList
      })
    })
  },
  //删除图片
  delFn(e){
    let { index } = e.currentTarget.dataset;
    let { imageUrlList} = this.data;
    imageUrlList.splice(index, 1);
    this.setData({
      imageUrlList: imageUrlList
    })
  },
  //发布评论
  releaseFn(){
    let _this = this;
    let { beautyOrderIdFk, evalutionContent, evalutionRank, beautyServiceIdFk, evalutionStatus, headPortraitUrl, nickname, userIdFk, imageUrlList, delta, ind} = this.data;
    let { userInfo: { user: {token} } } = app.globalData;
    if (!evalutionContent){
      wx.showModal({
        title: '提示',
        content: '请添加评论内容',
        showCancel: false,
        confirmColor: '#0076FF'
      });
    } else if (imageUrlList.length == 0){
      wx.showModal({
        title: '提示',
        content: '请添加评论图片',
        showCancel: false,
        confirmColor: '#0076FF'
      });
    }else{
      app.wxRequestFn({
        method: 'get'
        , url: '/beautyEval/addEvaluationTable'
        , data: {
          token,
          beautyOrderIdFk,
          evalutionContent,
          evalutionRank,
          beautyServiceIdFk,
          evalutionStatus,
          headPortraitUrl,
          nickname,
          userIdFk,
          imageUrlList
        }
      }, res => {
        if (res) {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - (Number(delta)+1)];  //上一个页面
          let beautyInfoOrderTableList = prevPage.data.beautyInfoOrderTableList //取上页data里的数据也可以修改
          beautyInfoOrderTableList.splice(ind, 1);
          prevPage.setData({
            status:6,
            beautyInfoOrderTableList: beautyInfoOrderTableList
          })//设置数据
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '评论成功',
            showCancel: false,
            confirmColor: '#0076FF'
          });
          setTimeout(function(){
            wx.navigateBack({
              delta: Number(delta)
            })
          },1500)
        }
      },false,true)
    }
  }
})