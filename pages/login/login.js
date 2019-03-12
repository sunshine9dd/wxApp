// components/login/login.js
const app = getApp();
Page({
  /**
   * 组件的初始数据
   */
  data: {
     wh:'64px', //封面图的初始宽度
     nickname:'',//昵称
     mobile:'', //手机号
     password:'', //密码
     array:['普通用户','门店用户'], //用户类型
     flag:1,//1表示普通用户，2表示网店用户
     shopCode:'' ,//门店邀请码
     userCode: '',//用户邀请码
     businessCode: '',//业务人员邀请码
     shopOwnerName:'',//店主姓名
     shopName: '', //店铺名称
     shopAddress:'', //店铺地址
     shopRange: '', //店铺经营范围
     imgSrc:'', //店铺封面图
     index:0 //当前选择的用户类型
  },
  //输入获取值
  bindInput(e) {
    let { dataset: { type } } = e.currentTarget
    switch (type) {
      case 'nickname':
        this.setData({
          nickname: e.detail.value
        })
        break
      case 'mobile':
        this.setData({
          mobile: e.detail.value
        })
        break
      case 'password':
        this.setData({
          password: e.detail.value
        })
        break
      case 'shopCode':
        this.setData({
          shopCode: e.detail.value
        })
        break
      case 'userCode':
        this.setData({
          userCode: e.detail.value
        })
        break
      case 'businessCode':
        this.setData({
          businessCode: e.detail.value
        })
        break
      case 'shopOwnerName':
        this.setData({
          shopOwnerName: e.detail.value
        })
        break
      case 'shopName':
        this.setData({
          shopName: e.detail.value
        })
        break
      case 'shopAddress':
        this.setData({
          shopAddress: e.detail.value
        })
        break
      case 'shopRange':
        this.setData({
          shopRange: e.detail.value
        })
        break
    }
  },
  //筛选用户类型
  bindPickerChange: function (e) {
    let index = e.detail.value;
    let flag = 1;
    if(index == 1){
      flag = 2;
    }
    this.setData({
      index: e.detail.value,
      flag
    })
  },
  //点击扫一扫
  scanFn(e){
    let _this = this;
    let { dataset: { type} } = e.currentTarget
    wx.scanCode({
      success: (res) => {
        if(type == '1'){
          _this.setData({
            shopCode: res.result
          })
        } else if (type == '2'){
          _this.setData({
            userCode: res.result
          })
        } else if (type == '3') {
          _this.setData({
            businessCode: res.result
          })
        }
        
      }
    })
  },
  //获取位置
  addressFn(){
    let _this = this;
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        _this.setData({
          shopAddress: res.address
        })
      }
    })
  },
  //获取本地图片
  imgFn(){
    let _this = this;
    app.uploadImgFn(function(res){  //调用七牛上传图片并返回图片链接地址
      _this.setData({
        imgSrc: res,
        wh: '100%'
      })
    })
  },
    // 确定
    goNext() {
      let _this = this;
      let { nickname, mobile, password, flag, shopCode, userCode, businessCode,shopOwnerName,shopName,shopAddress,shopRange,imgSrc} = this.data
        , { mobileRegular, wxUserInfo: { nickName, avatarUrl, gender }, userInfo: { openid}} = app.globalData;
      let relationImageUrlList = [];
      if (!nickname) {
        wx.showModal({
          title: '提示',
          content: '请输入昵称！',
          showCancel: false,
          confirmColor: '#0076FF'
        })
      } else if (!mobile) {
        wx.showModal({
          title: '提示',
          content: '请输入手机号！',
          showCancel: false,
          confirmColor: '#0076FF'
        })
      } else if (!mobileRegular.test(mobile)) {
        wx.showModal({
          title: '提示',
          content: '手机号不正确！',
          showCancel: false,
          confirmColor: '#0076FF'
        })
      } else if (!password) {
        wx.showModal({
          title: '提示',
          content: '请输入密码！',
          showCancel: false,
          confirmColor: '#0076FF'
        })
      }else if (!password) {
        wx.showModal({
          title: '提示',
          content: '请输入密码！',
          showCancel: false,
          confirmColor: '#0076FF'
        })
      }else{
        if(flag == 1){ //如果是普通用户
          if (!shopCode) {
            wx.showModal({
              title: '提示',
              content: '请输入邀请码！',
              showCancel: false,
              confirmColor: '#0076FF'
            })
          }else{
            app.wxRequestFn({
              method: 'get'
              , url: '/user/addWeiXinBindUser'
              , data: {
                userName: mobile,
                password: password,
                phone:mobile,
                headPortraitUrl: avatarUrl,
                nickname: nickname,
                sex: gender,
                type:flag,
                openid: openid,
                shopIdFk: shopCode,
                status:0
              }
            }, res => {
              if (res) {
                app.globalData.userInfo = res
                wx.switchTab({
                  url: '/pages/index/index' // 登录成功，跳转到首页
                })
              }
            })
          }
        }else{ //如果是网店用户
          if (!shopName) {
            wx.showModal({
              title: '提示',
              content: '请输入门店名称！',
              showCancel: false,
              confirmColor: '#0076FF'
            })
          } else if (!shopAddress) {
            wx.showModal({
              title: '提示',
              content: '请输入店铺地址！',
              showCancel: false,
              confirmColor: '#0076FF'
            })
          } else if (!businessCode) {
            wx.showModal({
              title: '提示',
              content: '请输入业务人员邀请码！',
              showCancel: false,
              confirmColor: '#0076FF'
            })
          } else if (!shopRange) {
            wx.showModal({
              title: '提示',
              content: '请输入店铺经营范围！',
              showCancel: false,
              confirmColor: '#0076FF'
            })
          } else if (!imgSrc) {
            wx.showModal({
              title: '提示',
              content: '请上传店铺封面图！',
              showCancel: false,
              confirmColor: '#0076FF'
            })
          }else {
            app.wxRequestFn({
              method: 'post'
              , 'content-type':'application/x-www-form-urlencoded'
              , url: '/user/addWeiXinBindUser'
              , data: {
                userName: mobile,
                password: password,
                phone: mobile,
                headPortraitUrl: avatarUrl,
                nickname: nickname,
                sex: gender,
                type: flag,
                openid: openid,
                shopName: shopName,
                shopOwnerName: shopOwnerName,
                shopOwnerPhone:mobile,
                shopAddress: shopAddress,
                businessScope: shopRange,
                platformUseStatus:0,
                workstaffId: businessCode,
                shopIdFk: businessCode,
                status: 0,
                shopImageUrl: imgSrc
              }
            }, res => {
              if (res) {
                app.globalData.userInfo = res
                wx.switchTab({
                  url: '/pages/index/index' // 登录成功，跳转到首页
                })
              }
            })
          }
        }
      }
    }
})