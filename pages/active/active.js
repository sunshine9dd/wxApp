// pages/active/active.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex:0,
    circular:true,
    scrollBoxHeight:0,//高度
    salesVolumeList: [],//销量列表
    salesVolumeNum: 1, //销量当前页码
    salesVolumeTotal: 1,//销量总页数
    salesVolumeFlag: false,//销量列表当可以下拉加载时为true,不能继续加载时为false
    scoreList: [],//评分列表
    scoreNum: 1,//评分当前页码
    scoreTotal: 1,//评分总页数
    scoreFlag: false //评分列表当可以下拉加载时为true,不能继续加载时为false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.salesVolumeFn(1);
    this.scoreFn(1);
  },
  //下拉刷新
  onPullDownRefresh() {
    let _this = this;
    setTimeout(() => {
      wx.stopPullDownRefresh() //停止下拉动作
      _this.setData({
        salesVolumeList: [],//销量列表
        salesVolumeNum: 1, //销量当前页码
        salesVolumeTotal:1,//销量总页数
        salesVolumeFlag: false ,//销量列表当可以下拉加载时为true,不能继续加载时为false
        scoreList: [],//评分列表
        scoreNum: 1,//评分当前页码
        scoreTotal: 1,//评分总页数
        scoreFlag: false //评分列表当可以下拉加载时为true,不能继续加载时为false
      })
      this.salesVolumeFn(1);
      this.scoreFn(1);
    }, 500)
  },
  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom() {
    let { curIndex,salesVolumeNum, salesVolumeTotal, salesVolumeFlag, scoreNum, scoreTotal, scoreFlag} = this.data;
    if (curIndex ==0){
      if (salesVolumeFlag && (salesVolumeNum < salesVolumeTotal)) {
        this.setData({
          salesVolumeFlag: false //当可以下拉加载时为true,不能继续加载时为false
        })
        this.salesVolumeFn((salesVolumeNum + 1));
      }
    }else{
      if (scoreFlag && (scoreNum < scoreTotal)) {
        this.setData({
          scoreFlag: false //当可以下拉加载时为true,不能继续加载时为false
        })
        this.scoreFn((scoreNum + 1));
      }
    }
  },
  // 最上方点击事件
  changeCurIndex(e){
    let index = e.target.dataset.index;
    let { salesVolumeList, scoreList } = this.data;
    this.setData({
      curIndex:index
    })
    if (index === 0) {
      this.setData({
        scrollBoxHeight: (salesVolumeList.length * 185)
      })
    } else {
      this.setData({
        scrollBoxHeight: (scoreList.length * 185)
      })
    }
  },
  // 滑动事件
  changeSwiper(e){
    let index = e.detail.current;
    let { salesVolumeList, scoreList} = this.data;
    this.setData({
      curIndex: index
    })
    if (index === 0) {
      this.setData({
        scrollBoxHeight: (salesVolumeList.length * 185)
      })
    }else{
      this.setData({
        scrollBoxHeight: (scoreList.length * 185)
      })
    }
  },
  //销量列表
  salesVolumeFn(num){
    let _this = this;
    let curIndex = this.data.curIndex;
    let salesVolumeFlag = false;
    let salesVolumeList = this.data.salesVolumeList;
    app.wxRequestFn({
      method: 'get'
      , url: '/beautyService/findWxBeaSerInfoListByType'
      , data: {
        type:1,
        pageSize: num,
        pageNum:10
      }
    }, res => {
      if (res) {
        res.beautyServiceInfoTableList.forEach(function (value, index) {
          let arr = [];
          for (let i = 0; i < value.beautyServiceRank; i++) {
            arr.push(i);
          }
          res.beautyServiceInfoTableList[index].beautyServiceRank = arr;
          salesVolumeList.push(res.beautyServiceInfoTableList[index]);
        })
        if (num < res.totalPageNum){
          salesVolumeFlag = true;
        }
        _this.setData({
          salesVolumeList: salesVolumeList,
          salesVolumeTotal: res.totalPageNum,
          salesVolumeFlag: salesVolumeFlag
        })
        if (curIndex === 0) {
          _this.setData({
            scrollBoxHeight: (salesVolumeList.length * 185)
          })
        }
      }
    })
  },
  //评价列表
  scoreFn(num) {
    let _this = this;
    let curIndex = this.data.curIndex;
    let scoreFlag = false;
    let scoreList = this.data.scoreList;
    app.wxRequestFn({
      method: 'get'
      , url: '/beautyService/findWxBeaSerInfoListByType'
      , data: {
        type: 2,
        pageSize: num,
        pageNum: 10
      }
    }, res => {
      if (res) {
        res.beautyServiceInfoTableList.forEach(function (value, index) {
          let arr = [];
          for (let i = 0; i < value.beautyServiceRank; i++) {
            arr.push(i);
          }
          res.beautyServiceInfoTableList[index].beautyServiceRank = arr;
          scoreList.push(res.beautyServiceInfoTableList[index]);
        })
        if (num < res.totalPageNum) {
          scoreFlag = true;
        }
        _this.setData({
          scoreList: scoreList,
          scoreTotal: res.totalPageNum,
          scoreFlag: scoreFlag
        })
        if (curIndex === 1) {
          _this.setData({
            scrollBoxHeight: (scoreList.length * 185)
          })
        }
      }
    })
  }
})