// pages/user-account/user-account.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
  
  },
  onLoad: function (options) {

  },
  onShow(){
    const { id } = app.globalData.worker;
    util.get(`api/acount/info/${id}`).then((data) => {
      this.setData({
        data
      })
    })
  }
})