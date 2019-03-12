//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    beautyServiceInfoTableList:[], //活动列表
    autoplay:true,
    imgUrls: [
      { src: "http://image.hjninan.com/banner1.jpg", type: "IMG" },
      { src: "http://image.hjninan.com/bannervideo1.mp4", type: "VIDEO" },
       { src: "http://image.hjninan.com/banner2.jpg", type: "IMG" },
      { src: "http://image.hjninan.com/bannervideo2.mp4", type: "VIDEO" },
      { src: "http://image.hjninan.com/banner3.jpg", type: "IMG" }
       ] //轮播图
  },
  onLoad: function () {
    let _this = this;
    app.wxRequestFn({
      method: 'post'
      , url: '/beautyService/findWxTopfiveBeaSerInfo'
      , data: {}
    }, res => {
      if (res) {
        res.beautyServiceInfoTableList.forEach(function(value,index){
          let arr = [];
          for (let i=0; i<value.beautyServiceRank;i++){
            arr.push(i);
          }
          res.beautyServiceInfoTableList[index].beautyServiceRank = arr;
        })
        _this.setData({
          beautyServiceInfoTableList: res.beautyServiceInfoTableList
        })
      }
    })
  },
  changeStore(){
    wx.navigateTo({
      url: '../storelist/storelist'
    })
  },
  goOrderCenter(){
    wx.switchTab({
      url: '../active/active'
    })
  },
  bindplayFn(){
    this.setData({
      autoplay:false
    })
  },
  bindpauseFn(){
    this.setData({
      autoplay: true
    })
  },
  bindendedFn(){
    this.setData({
      autoplay: true
    })
  }
})
