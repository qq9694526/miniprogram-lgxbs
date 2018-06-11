//app.js
const util = require('utils/util.js');
App({
  onLaunch: function () {
    
  },
  login(callback) {
    wx.showLoading({
      title: '加载中'
    })
    const tel = wx.getStorageSync("tel") || "";
    Promise.all([this.getOpneid(), this.getUserInfo()]).then(v => {
      const [{ openid: opId, session_key }, { nickName: userName, gender: userSex, avatarUrl: userPhoto }] = v;
      util.post("api/login", {
        opId,
        userMobile: tel,
        userName,
        userSex,
        userPhoto
      }).then((data) => {
        wx.hideLoading();
        data.sessionKey = session_key;
        this.globalData.user = data.userInfo;
        this.globalData.worker = data.workInfo;
        console.log(data);
        if (callback) { callback() }
      })
    })
  },
  getOpneid() {
    return new Promise((resolve) => {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res.code)
          util.get("api/wx/getkey/" + res.code).then((data) => {
            resolve(data);
          })
        }
      })
    })
  },
  getUserInfo() {
    console.log(111)
    return new Promise((resolve) => {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          // if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              resolve(res.userInfo)
            }
          })
          // }
        }
      })
    })
  },
  globalData: {
    userInfo: null
  }
})