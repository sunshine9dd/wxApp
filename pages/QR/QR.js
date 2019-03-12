// pages/QR/QR.js
const app = getApp();
const QRCode = require('../../utils/weapp-qrcode.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let { userInfo: { user: { inviteCode } } } = app.globalData;
    let qrcode = new QRCode('canvas', {
      text: inviteCode,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    this.setData({
      inviteCode
    })
  },
})