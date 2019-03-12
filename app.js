//app.js
const qiniuUploader = require("./utils/qiniuUploader");
App({
  globalData: {
    appid: 'wxa52708a26ee25649 '
    , headPortrait: '/img_admin.png' // 管理员头像
    , mobileRegular: /^(0|86|17951)?(13[0-9]|15[012356789]|17[012345678]|18[0-9]|14[56789]|19[89]|166)[0-9]{8}$/ // 手机号正则
    , engRegular: /[^\a-\z\A-\Z]/g // 只能输入英文 type=eng
    , ecnRegular: /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g // 只能输入英文中文数字 type=ecn
    , ecn2Regular: /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\_\,\，\.\。\;\；\:\：\'\‘\’\"\“\”\、\…]/g // 输入英文中文数字标点 type=ecn2
    , code: '' // js_code
    , wxUserInfo: {} // 微信用户信息
    , userInfo: {} // 登录返回的信息，如userId
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  /**
    * @param obj
    *      参数
    *          1.method
    *          2.url
    *          3.data（非必须）
    *          4.'content-type'（非必须）
    * @param cb 回调
    * @param start 请求前：不传表示执行loading效果、true表示不执行loading效果
    * @param end 请求完成：不传表示关闭loading效果、true表示不执行关闭loading效果
    * @param fh 请求不管成功还是失败都回调，可不传
    */
  wxRequestFn(obj, cb, start = false, end = false, fh) {
    let _this = this;
    if (!start) {
      wx.showLoading({
        mask: true
      })
    }
    let { brandId, userInfo: { token, mobile, id } } = this.globalData
    wx.request({
      method: obj.method,
      url: `https://wemsg.hjninan.com/sanxijiangren${obj.url}`, // 线上测试
      header: {
        'content-type': obj['content-type'] ? obj['content-type'] : 'application/json'
        , token: token ? token : ''
        , userId: id ? id : ''
      },
      data: obj.data ? obj.data : {},
      success(res) {
        let { resultFlag, errorMessage, data } = res.data;
        if(resultFlag == '1') {
          cb(data) // 回调 
        }else if (resultFlag == '-1') {
          _this.globalData.userInfo = data
          wx.redirectTo({
            url: '/pages/login/login' // 登录
          })
        }else {
          wx.showModal({
            title: '提示',
            content: errorMessage ? errorMessage : '未知错误',
            showCancel: false,
            confirmColor: '#0076FF'
          })
        }
      },
      fail(err) {
        wx.showModal({
          title: '提示',
          content: '网络异常',
          showCancel: false,
          confirmColor: '#0076FF'
        })
      },
      complete() {
        if (!end) {
          wx.hideLoading()
        }
        if (fh) {  //如果有请求完成回调则执行
          fh()
        }
      }
    })
  },
  /**
   * 获取微信用户信息
   * @param cb 设置noNetwork
   */
  getUserInfoFn(cb) {
    const _this = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: 'zh_CN',
            success(res) {
              _this.globalData.wxUserInfo = res.userInfo

              _this.LoginFn() // 登录

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // 未授权跳转到授权页
          wx.redirectTo({
            url: '/pages/author/author'
          })
        }
      },
      fail() {
        // 授权失败
        if (cb) {
          cb(true)
        }
      }
    })
  },
  LoginFn() { // 登录
    const _this = this;
    wx.login({
      success(res) {
        let { code } = res
        if (code) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          _this.globalData.code = code
          _this.wxRequestFn({
            method: 'GET'
            , url: '/getOpenIdByCode'
            , data: {
              code
            }
          }, res => {
            if (res) {
              _this.globalData.userInfo = res
              wx.switchTab({
                url: '/pages/index/index' // 登录成功，跳转到首页
              })
            }
          }, true, true)
        } else {
          wx.showModal({
            title: '提示',
            content: '微信登录失败！',
            showCancel: false,
            confirmColor: '#0076FF'
          })
        }
      }
    })
  },
  //上传图片到七牛云
  uploadImgFn(cb) {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        let imgKey = 'sxjr-' + Date.parse(new Date()) + '.jpg';
        wx.showLoading({
          mask: true
        })
        qiniuUploader.upload(filePath, (result) => {
          wx.hideLoading();
          if(cb){
            cb(result.imageURL);
          }
        }, (error) => {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: 'error: ' + error,
            showCancel: false,
            confirmColor: '#0076FF'
          })
        }, {
            region: 'ECN', // 华东区
            uploadURL: 'https://up.qiniup.com',
            domain: 'http://image.hjninan.com',
            uptoken: 'OekmVO2jr31nYPJVE1SbyNhfeyPbgX0x6Ubk6Tah:xcsgt1T5ikw-HsO9QiBghi3OZpo=:eyJzY29wZSI6InNhbnhpamlhbmdyZW4iLCJkZWFkbGluZSI6MTU5ODAyMTc4NX0=',
            shouldUseQiniuFileName: false,
            key: imgKey
          })
      }
    })
  }
})