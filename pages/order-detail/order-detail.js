// pages/order-detail/order-detail.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStateArr: ['全部', '预约中', '待完成', '待付款', '待评价', '已完成', '已取消']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, isbook, isworker } = options,
      user = app.globalData.user;
    this.setData({
      id,
      user,
      isbook,
      isworker
    })
  },
  onShow() {
    this.init();
  },
  init() {
    this.getOrder();
  },
  onPullDownRefresh() {
    this.init();
    wx.stopPullDownRefresh();
  },
  getOrder() {
    const { id } = this.data;
    util.get(`api/order/info/${id}`).then((data) => {
      data.time = util.formatTime(new Date(data.createTime));
      this.setData({
        order: data
      })
      console.log(data.orderState == 2)
    })
  },
  cancelOrder() {
    const { id, workerId } = this.data.order,
      that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确定要取消该订单吗？当天取消两次订单后将不能再进行预约（抢单）。',
      success: function (res) {
        if (res.confirm) {
          util.post('api/order/update', { id, orderState: 6, workerId }).then((data) => {
            if (data == 0) {
              wx.showToast({
                title: '取消成功',
                icon: 'none'
              })
              that.init();
            }
          })
        } else if (res.cancel) {
        }
      }
    })

  },
  goComment() {
    const { workerId, id: orderId } = this.data.order;
    wx.navigateTo({
      url: `../comment-detail/comment-detail?workerId=${workerId}&orderId=${orderId}`
    })
  },
  confirmOver() {
    const { id, workerId } = this.data.order,
      that = this;
    util.post('api/order/update', { id, orderState: 4, workerId }).then((data) => {
      if (data == 0) {
        wx.showModal({
          title: '温馨提示',
          content: '您确定师傅已经完工了吗？确定完工您将支付费用给师傅。',
          success: function (res) {
            if (res.confirm) {
              //调起支付
              that.goPay();
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  },
  goPay() {
    const openId = app.globalData.user.opId,
      { id } = this.data,
      that = this;
    if (false) {
      sucessCallback();
    } else {//微信支付
      util.get(`api/order/getsign/${id}/${openId}`).then((data) => {
        const { nonceStr, package: packages, paySign, signType, timeStamp } = data;
        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': packages,
          'signType': signType,
          'paySign': paySign,
          'success': function (res) {
            sucessCallback();
          }
        })
      })
    }
    function sucessCallback() {
      util.get(`api/order/pay_back/${id}`).then((data) => {
        wx.showToast({
          title: '支付成功'
        })
        that.init();
      })
    }
  },
  grabOrder(e) {
    const { id: workerId } = app.globalData.worker,
      { id } = this.data;
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
      } else {
        wx.showToast({
          title: data,
          icon: "none"
        })
      }
    })
  }
})