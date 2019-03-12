// pages/author/author.js
const app=getApp()

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo') // 判断小程序的API，回调，参数，组件等是否在当前版本可用
    },
    onGetUserInfo(e){
        let {userInfo}=e.detail // 获取用户信息
        if(userInfo){
            app.globalData.wxUserInfo=userInfo

          app.LoginFn() // 登录
        }
    }
})