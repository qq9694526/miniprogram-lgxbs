// pages/user-center/user-center.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {user,worker}=app.globalData;
    this.setData({
      user,
      worker
    })
  },
  chooseAddress(){
    wx.chooseAddress();
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: '0371—55313833'
    })
  }
})