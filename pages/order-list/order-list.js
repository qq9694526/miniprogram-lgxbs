// pages/order-list/order-list.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    orderStateArr: ['全部', '预约中', '待完成', '待付款', '待评价', '已完成', '已取消'],
    tabbarArr: [0, 1, 2, 3],
    activeItem: 0
  },
  onLoad: function (options) {
    const { isbook, status } = options;
    const { userFlag}=app.globalData.user;
    const activeItem = status ? status : 0;
    let tabbarArr = isbook ? [0, 1, 2, 3] : [0, 2, 3, 4];
    this.setData({
      isbook,
      tabbarArr,
      activeItem
    })
  },
  init() {
    this.getOrder();
  },
  onPullDownRefresh() {
    this.init();
    wx.stopPullDownRefresh();
  },
  onShow(){
    this.init();
  },
  changeItem(e) {
    const { index } = e.target.dataset;
    this.setData({
      activeItem: index
    })
  },
  getOrder() {
    const { id, userFlag } = app.globalData.user,
      { isbook } = this.data;
    let url = isbook ? `api/advance/order/${id}` : `api/user/order/${id}/${userFlag}`;
    util.get(url).then((data) => {
      this.setData({
        list: data
      })
    })
  },
  cancelOrder(e) {
    const { id,workerId } = e.target.dataset,
      that=this;
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
  goComment(e) {
    const { workerId,orderId } = e.target.dataset;
    wx.navigateTo({
      url: `../comment-detail/comment-detail?workerId=${workerId}&orderId=${orderId}`
    })
  },
  confirmOver(e) {
    const { id, workerId } = e.target.dataset,
      that = this;
    util.post('api/order/update', { id, orderState: 3, workerId }).then((data) => {
      if (data == 0) {
        wx.showModal({
          title: '温馨提示',
          content: '您确定师傅已经完工了吗？确定完工您将支付费用给师傅。',
          success: function (res) {
            if (res.confirm) {
              //调起支付
              that.goPay(id);
            } else if (res.cancel) {

            }
          }
        })
      }
    })
  },
  bindPay(e) {
    const { id } = e.target.dataset;
    this.goPay(id);
  },
  goPay(id) {
    const openId = app.globalData.user.opId,
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
})