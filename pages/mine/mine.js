// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPhoneInfo()
  },

  // 获取手机信息的api
  getPhoneInfo () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          b: res.brand,
          m: res.model,
          s: res.system,
          bl: res.benchmarkLevel
        })
      }
    })
  },

  //复制地址
  CopyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },

  //赞赏码
  showQrcode() {
    wx.previewImage({
      urls: ['https://yang2001.com/upload/2021/06/wxfk-94dbfaa2d6a94b0ebb3731fde9d5e502.jpg'],
      current: 'https://yang2001.com/upload/2021/06/wxfk-94dbfaa2d6a94b0ebb3731fde9d5e502.jpg' // 当前显示图片的http链接
    })
  },
})