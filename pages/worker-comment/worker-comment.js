// pages/worker-comment/worker-comment.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
  
  },
  onLoad: function (options) {
    const {id}=options;
    this.setData({
      id
    })
    this.getComment();
  },
  getComment(){
    const id=this.data.id;
    util.post(`api/evaluation/query/${id}`).then((data)=>{
      let list=data;
      list.forEach((v,i)=>{
        list[i].time = util.formatTime(new Date(v.evaluationTime));
      })
      this.setData({
        list
      })
    })
  }
})