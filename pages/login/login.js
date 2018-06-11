// pages/login/login.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  data: {
    sent: false,
    timeLeft: 60,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function (options) {

  },
  bindTelInput(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  bindCodeInput(e) {
    this.setData({
      inputCode: e.detail.value
    })
  },
  sendCode() {
    const { tel } = this.data;
    if (!tel) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    util.get(`api/send_verify/${tel}`).then((data) => {
      if (data && data.rtnCode == "1000") {
        const { verifyCode } = data;
        console.log(tel)
        this.setData({
          verifyCode,
          sent: true
        })
        wx.showToast({
          title: '已发送',
          icon: 'none'
        })
        this.setSent();
      }
    })
  },
  goIndex(e) {
    const userInfo = e.detail.userInfo;
    const { tel, inputCode, verifyCode } = this.data;
    console.log(this.data);
    //表单验证
    if (!tel) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    if (!inputCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    if (inputCode === verifyCode) {
      wx.setStorageSync('tel', tel)
      wx.navigateTo({
        url: '../index/index'
      })
    } else {
      wx.showToast({
        title: '验证码不正确',
        icon: 'none'
      })
    }
  },
  setSent() {
    var self = this;
    var interval = setInterval(() => {
      let timeLeft = this.data.timeLeft - 1;
      if (timeLeft > 0) {
        self.setData({
          timeLeft
        })
      } else {
        self.setData({
          sent: false,
          timeLeft: 60
        })
        clearInterval(interval);
      }
    }, 1000)
  }
})