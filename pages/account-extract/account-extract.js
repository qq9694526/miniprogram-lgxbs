// pages/account-extract/account-extract.js
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
    const {worker} = app.globalData;
    util.get(`api/acount/info/${worker.id}`).then((data) => {
      this.setData({
        worker,
        data
      })
    })
  },
  extract(e) {
    const { availAcount } = e.detail.value,
      { id: userId } = app.globalData.worker;
    if (!availAcount || availAcount.length === 0) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return
    }
    if (availAcount == 0) {
      wx.showToast({
        title: '提现金额不能为0',
        icon: 'none'
      })
      return
    }
    if (availAcount > this.data.data.totalAcount) {
      wx.showToast({
        title: '提现金额不能大于钱包余额',
        icon: 'none'
      })
      return
    }
    wx.showLoading();
    util.post(`api/acount/extract`, {
      userId,
      availAcount
    }).then((data) => {
      wx.hideLoading();
        if(data==0){
          wx.showToast({
            title: '提现成功',
            icon:"none"
          })
          setTimeout(()=>{
            wx.navigateBack();
          },500)
        }
    })
  }
})