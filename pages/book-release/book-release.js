// pages/book-release/book-release.js
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
    const now = new Date(),
      nowDate = util.formatTime(now);
    console.log(nowDate);
    const date = nowDate.split(' ')[0].replace(/\//g, '-'),
      timeArr = nowDate.split(' ')[1].split(":"),
      time = timeArr[0] + ':' + timeArr[1] + ':00';
    this.setData({
      date,
      time
    })
  },
  goBookList() {
    wx.navigateTo({
      url: '../book-list/book-list',
    })
  },
  book(e) {
    if (!this.data.address) {
      wx.showToast({ title: '请选择服务地址', icon: 'none' })
      return
    }
    const { id: userId } = app.globalData.user,
      { name: userName, tel: userMobile, detail: userAddress } = this.data.address,
      { advanceName, orderPrice, serviceDesc } = e.detail.value,
      serviceTime = this.data.date + ' ' + this.data.time;
    if (!advanceName) {
      wx.showToast({ title: '请填写服务名称', icon: 'none' })
      return
    }
    if (!orderPrice) {
      wx.showToast({ title: '请填写服务价格', icon: 'none' })
      return
    }
    wx.showLoading();
    util.post('api/order/advance', {
      userId,
      userAddress,
      userName,
      userMobile,
      serviceTime,
      advanceName,
      serviceDesc,
      orderPrice
    }).then((data) => {
      wx.hideLoading();
      if (data == 0) {

        wx.showToast({
          title: '发布成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '../order-list/order-list?isbook=1',
          })
        }, 500)
      } else {
        wx.showToast({
          title: data,
          icon: "none"
        })
      }
    })
  },
  chooseAddress() {
    const that = this;
    wx.chooseAddress({
      success: function (res) {
        const detail = res.provinceName + res.cityName + res.countyName + res.detailInfo;
        that.setData({
          address: {
            name: res.userName,
            tel: res.telNumber,
            detail
          }
        })
      }
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
})