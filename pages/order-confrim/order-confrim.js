// pages/order-confrim/order-confrim.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onLoad(options){
    const { id } = options;
    this.setData({
      id
    })
    this.getWorker();
  },
  getWorker() {
    const { id } = this.data;
    util.get(`api/wx/worker/${id}`).then((data) => {
      this.setData({
        worker: data
      })
    })
  },
  goOrder(){
    wx.navigateTo({
      url: '../order-detail/order-detail',
    })
  },
  submitOrder(e){
    if (!this.data.address) {
      wx.showToast({ title: '请选择服务地址', icon: 'none' })
      return
    }
    wx.showLoading();
    const { id: userId } = app.globalData.user,
      { name: userName, tel: userMobile, detail: userAddress } = this.data.address,
      { desc:serviceDesc } = e.detail.value,
      { workTitle: serviceName, workPrice: orderPrice, id: workerId}=this.data.worker,
      serviceTime = this.data.date + ' ' + this.data.time;
    util.post('api/order/lock_user',{
      workerId,
      userId,
      userAddress,
      userName,
      userMobile,
      serviceName,
      serviceDesc,
      orderPrice
    }).then((data)=>{
      wx.hideLoading();
      if(data==0){
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '../order-list/order-list',
          })
        }, 500)
      }else{
        wx.showToast({
          title: data,
          icon: 'none'
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
  }
})