// pages/account-list/account-list.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
  
  },
  onLoad: function (options) {
    this.getList()
  },
  getList(){
    const {id}=app.globalData.worker;
    util.get(`api/extract/record_all/${id}`).then((data)=>{
      data.forEach((v,i)=>{
        data[i].time = util.formatTime(new Date(v.opTime));
      })
      this.setData({
        list:data
      })
    })
  }
})