/*
 * @Description:
 * @Author: RyangXie
 * @Date: 2021-11-28 10:32:01
 * @LastEditTime: 2021-11-28 10:32:01
 * @LastEditors: RyangXie
 * @Reference:
 */
import { request } from '../../request/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // http://tmp/b7lTP0AWFTfV7c0d7b41b947da700c194246f1c8e1c1.jpeg
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
  // 获取一言
  hitokoto: function () {
    // 发起请求
    request({
      // 请求路径
      url: "https://v1.hitokoto.cn",
      // 请求方式
      method: "GET",
      dataType: 'json'
    }).then(res => {
      // console.log(res.data.hitokoto)
      this.setData({
        hitokoto: res.data.hitokoto
      })
      // 停止下拉刷新的动作
      wx.stopPullDownRefresh()
    })
  },
  // 选择图片
  openImg: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res.tempFilePaths[0]);
        this.setData({
          tempFilePaths: res.tempFilePaths[0]
        })
        // const faceId = wx.getStorageSync('access_token')
        // if (!faceId) {
        //   this.getToken()
        // } else {
        //   if (Date.now() - faceId.time > 1000 * 600) {
        //     this.getToken()
        //   } else {
        //     this.faceId = faceId.access_token
        //   }
        // }
        this.getbase64(res.tempFilePaths[0])
      }
    })
  },
  // 图片转base64位方法
  getbase64 (filePath) {
    // 获取全局的文件管理器
    const FileSystem = wx.getFileSystemManager()
    // console.log(FileSystem);
    // 读取本地文件内容
    FileSystem.readFile({
      filePath,
      encoding: "base64",
      success: res => {
        // console.log(res.data);
        this.getToken(res.data)
      }
    })
  },
  // 3 获取token
  getToken: function (base) {
    request({
      //请求地址
      url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=K4d39yTVnrhtUiDo4VN9hIpj&client_secret=iPqev24I7aoXP34OUpy2UqIZUOto3V4r`,
      //请求方式
      method: "POST",
      //请求参数
      //如果接口调用成功
    }).then(res => {
      console.log(res.data.access_token);
      const access_token = res.data.access_token
      // wx.setStorageSync('access_token', { time: Date.now(), access_token })
      this.getInfoFace(access_token, base)
    })
  },
  // 4.通过token调用人脸识别接口
  getInfoFace (token, base) {
    request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + token,
      method: "POST",
      // 请求头
      header: {
        "Content-Type": "application/json"
      },
      // 请求参数
      data: {
        // 图片的信息
        image: base,
        // 图片的格式
        image_type: 'BASE64'
      }
    }).then(res => {
      // 获取图片base64
      console.log(res.data);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getbase64()
    this.hitokoto()
    this.getPhoneInfo()
    // this.getToken()
  }
})