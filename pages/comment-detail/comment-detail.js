// pages/comment-detail/comment-detail.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    stars: [5, 5, 5]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { workerId, orderId}=options;
      this.setData({
        workerId,
        orderId
      })
  },
  clickStar(e) {
    console.log(e);
    const { index } = e.target.dataset;
    let stars = this.data.stars;
    if (index) {
      stars[index.split("-")[0]] = parseInt(index.split("-")[1])+1;
    }
    console.log(stars)
    this.setData({
      stars
    })
  },
  submitComment(e) {
    const { evaluationContent } = e.detail.value,
      { stars, images, workerId: workId, orderId } = this.data,
      {id:userId,userName}=app.globalData.user;
    if (!evaluationContent) {
      wx.showToast({
        title: '评论不能为空，写点什么吧',
        icon: 'none'
      })
    }
    console.log({
      evaluationContent,
      stars,
      images
    });
    let evaluationPicture1 = images[0] ? images[0]:"",
      evaluationPicture2 = images[1] ? images[1] : "",
      evaluationPicture3 = images[2] ? images[2] : "";
    util.post(`api/evaluation/save`, {
      userId,
      userName,
      evaluationContent,
      evaluationSpeed: stars[0],
      evaluationQuiality: stars[2],
      evaluationAttitude: stars[1],
      workId,
      orderId,
      evaluationPicture1,
      evaluationPicture2,
      evaluationPicture3
    }).then((data) => {
        if(data==0){
          wx.showToast({
            title: '提交成功',
            icon:"none"
          })
          setTimeout(()=>{
            wx.navigateBack()
          },500)
        }
    })
  },
  chooseImage(e) {
    let that = this;
    wx.chooseImage({
      count: 3,  //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中'
        })
        const tempFilePaths = res.tempFilePaths;
        let promiseArr = [];
        tempFilePaths.forEach((v, i) => {
          promiseArr.push(that.uploadImage(v));
        })
        Promise.all(promiseArr).then((data) => {
          that.setData({
            images: data
          })
          wx.hideLoading();
        })
      }
    })
  },
  uploadImage(path) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'https://abc.zhaohaipeng.com/api/evaluation/upload ', //开发者服务器 url
        filePath: path,//要上传文件资源的路径
        name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
        formData: { //HTTP 请求中其他额外的 form data
          'user': 'test'
        },
        header: { "Content-Type": "multipart/form-data" },
        success: function (res) {
          const data = JSON.parse(res.data);
          if (data.errno != 0) {
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
            return;
          }
          const { url } = data.data;
          resolve(url)
        },
        fail: function (e) {
          console.log(e)
          reject(e)
        }
      })
    })
  }
})