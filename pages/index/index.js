//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    grid: 10
  },
  onLoad: function () {
    // this.init();
  },
  onShow(){
    this.init();
  },
  onPullDownRefresh(){
    this.init();
    wx.stopPullDownRefresh();
  },
  init() {
    app.login(() => {
      this.getIndex();
      this.getOrder();
      const user = app.globalData.user;
      this.setData({
        user
      })
    });
  },
  getIndex() {
    util.get('api/wx/index').then((data) => {
      const { banner, workCates, workInfos } = data;
      this.setData({
        banner, workCates, workInfos
      })
    })
  },
  getOrder() {
    util.get('api/order/all').then((data) => {
      this.setData({
        order: data
      })
    })
  },
  grabOrder(e) {
    const { id: workerId } = app.globalData.worker,
      { id } = e.currentTarget.dataset;
    util.post('api/order/work_grab', { id, workerId }).then((data) => {
      if (data == 0) {
        wx.showToast({
          title: '抢单成功',
          icon: "none"
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '../order-list-worker/order-list-worker',
          })
        }, 500)
      }else{
        wx.showToast({
          title: data,
          icon: "none"
        })
      }
    })
  },
  goBookDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../order-detail/order-detail?id=${id}&isworker=1`
    })
  }
})
