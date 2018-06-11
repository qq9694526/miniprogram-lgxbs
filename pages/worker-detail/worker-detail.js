// pages/worker-detail/worker-detail.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [{
      imageUrl: '/img/banner.png'
    }, {
      imageUrl: '/img/banner.png'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    this.setData({
      id
    })
    this.init();
  },
  init() {
    this.getWorker();
  },
  onPullDownRefresh() {
    this.init();
    wx.stopPullDownRefresh();
  },
  goOrder() {
    wx.navigateTo({
      url: '../order-confrim/order-confrim?id=' + this.data.id,
    })
  },
  showBusy() {
    wx.showToast({
      title: '该师傅忙碌中，请选择其他师傅进行预约',
      icon: "none"
    })
  },
  getWorker() {
    const { id } = this.data;
    util.get(`api/wx/worker/${id}`).then((data) => {
      let worker = data;
      if (worker.userEvaluationEntity) {
        worker.userEvaluationEntity.time = util.formatTime(new Date(worker.userEvaluationEntity.evaluationTime));
      }
      this.setData({
        worker
      })
    })
  }
})