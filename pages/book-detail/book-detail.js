// pages/book-detail/book-detail.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  data: {
  
  },
  onLoad: function (options) {
    const { id } = options;
    this.setData({
      id
    })
    this.getOrder();
  },
  getOrder() {
    const { id } = this.data;
    util.get(`api/order/info/${id}`).then((data) => {
      this.setData({
        order: data
      })
    })
  },
})