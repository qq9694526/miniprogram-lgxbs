// pages/classify/classify.js
const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {
    activeIndex: 0
  },
  onLoad: function (options) {
    const { cate } = options;
    if (cate) {
      this.setData({
        cate
      })
    }
    this.init();
  },
  init() {
    this.getAllkind();
    this.getCate(this.data.activeIndex)
  },
  onPullDownRefresh() {
    this.init();
    wx.stopPullDownRefresh();
  },
  getAllkind() {
    util.get('api/wx/allkind').then((data) => {
      const cateId = this.data.cate;
      let activeIndex = 0;
      if (cateId) {
        data.forEach((v, i) => {
          if (v.id == cateId) {
            activeIndex = i;
          }
        })
      }
      this.setData({ menus: data, activeIndex })
      this.getCate(data[activeIndex].id);
    })
  },
  getCate(id) {
    util.get('api/wx/worker/cate/' + id).then((data) => {
      this.setData({ items: data })
    })
  },
  setCurrentActive(e) {
    const activeIndex = e.currentTarget.dataset.index,
      id = this.data.menus[activeIndex].id;
    util.get('api/wx/worker/cate/' + id).then((data) => {
      console.log(data)
      this.setData({ items: data, activeIndex })
    })
  }
})