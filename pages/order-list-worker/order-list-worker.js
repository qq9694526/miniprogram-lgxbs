// pages/book-list/book-list.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStateArr:['全部','预约中', '待完成', '待付款', '待评价', '已完成','已取消'],
    activeItem:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBooks();
  },
  onPullDownRefresh() {
    this.getBooks();
    wx.stopPullDownRefresh();
  },
  changeItem(e){
    const {index}=e.target.dataset;
    this.setData({
      activeItem:index
    })
  },
  getBooks(){
    const { id, userFlag}=app.globalData.user;
    util.get(`api/user/order/${id}/${userFlag}`).then((data)=>{
        let list=data;
        list.forEach((v,x)=>{
          v.forEach((n,y)=>{
            list[x][y].time = util.formatTime(new Date(n.createTime));
          })
        })
        this.setData({
          list
        })
    })
  }
})