// pages/account-detail/account-detail.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
  
  },
  onLoad: function (options) {
    const {id}=options,
      user=app.globalData.user;
    let  worker = app.globalData.worker;
    if (worker.workIdCard){

      worker.card4 = worker.workIdCard.substr(worker.workIdCard.length - 4);
    }
    this.setData({
      worker,
      user,
      id
    })
    this.getData()
  },
  getData() {
    const { id } = this.data;
    util.get(`api/extract/record_info/${id}`).then((data) => {
      data.time = util.formatTime(new Date(data.opTime));
      this.setData({
        data
      })
    })
  }
})