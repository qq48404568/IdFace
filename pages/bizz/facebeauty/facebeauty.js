// pages/bizz/facebeauty/facebeauty.js
import { request } from '../../../request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '颜值估测',
    result: [],
    images: {},
    resultData: null,
    img: '',
    faceNum: 0,
    modalName: '',
    modalTitle: null,
    modalContent: null
  },

  onLoad: function () {
    // this.getToken()
  },

  // 选择图片
  uploads: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二
      success: (res) => {
        // console.log(res.tempFilePaths);
        this.setData({
          img: res.tempFilePaths[0]
        })
        if (res.tempFilePaths[0].size > (4096 * 1024)) {
          wx.showToast({
            title: '图片文件过大哦',
            icon: 'none',
            mask: true,
            duration: 1500
          })
        } else {
          // 用图片临时路径，获取base64编码
          this.getbase64(res.tempFilePaths[0])
          // 调用图片尺寸的方法
          this.calc(res.tempFilePaths[0])
        }

      }
    });

  },
  // 计算图片尺寸
  calc (url) {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        console.log(350 / res.width);
        this.setData({
          i: 350 / res.width
        })
      }
    })
  },
  // 图片转base64位方法
  getbase64: function (filePath) {
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

  // 获取token
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

  // 通过token调用人脸识别接口
  getInfoFace: function (token, base) {
    wx.showLoading({
      title: "面部分析中...",
      mask: true
    }),
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
          image_type: 'BASE64',
          // 返回的人脸信息
          face_field: 'beauty,age,expression,face_shape,gender,glasses,landmark,landmark150,quality,eye_status,emotion,face_type,mask,spoofing'
        }
      }).then(res => {
        if (res.data.result) {
          wx.hideLoading()
        }
        // 获取图片base64
        console.log(res.data.result.face_list[0]);
        const face_list = res.data.result.face_list[0]
        this.setData({
          face_list
        })
      })
  },

  /**
* 点击查看图片，可以进行保存
*/
  preview (e) {
    var that = this;
    wx.previewImage({
      urls: [that.data.img],
      current: that.data.img
    })
  }
})