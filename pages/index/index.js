import { request } from '../../request/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    elements: [{
      title: 'AI颜值',
      name: 'beauty',
      color: 'cyan',
      dir:'aiindex',
      icon: 'emoji'
    },
    {
      title: 'AI健康',
      name: 'health',
      color: 'blue',
      dir:'aiindex',
      icon: 'like'
    },
    {
      title: 'AI恢复',
      name: 'recovery',
      color: 'red',
      dir:'aiindex',
      icon: 'refresh'
    },
    {
      title: 'AI审核 ',
      name: 'examine',
      color: 'orange',
      dir:'aiindex',
      icon: 'filter'
    },
    {
      title: 'AI处理',
      name: 'handle',
      color: 'olive',
      dir:'aiindex',
      icon: 'repair'
    },
    {
      title: 'NAI',
      name: 'nai',
      color: 'green',
      dir:'aiindex',
      icon: 'usefull'
    },
    {
      title: 'AI闲聊',
      name: 'chatbot',
      color: 'brown',
      dir:'bizz',
      icon: 'messagefill'
    }
    ],
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
  // 获取轮播图数据
  getSwiperList () {
    request({ url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata' })
      .then(result => {
        this.setData({
          swiperList: result.data.message
        })
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
        // 用图片临时路径，获取base64编码
        this.getbase64(res.tempFilePaths[0])
        // 调用图片尺寸的方法
        this.calc(res.tempFilePaths[0])
      }
    })
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
        image_type: 'BASE64',
        // 返回的人脸信息
        face_field: 'beauty,age,expression,face_shape,gender,glasses,landmark,landmark150,quality,eye_status,emotion,face_type,mask,spoofing'
      }
    }).then(res => {
      // 获取图片base64
      console.log(res.data.result.face_list[0]);
      const face_list = res.data.result.face_list[0]
      this.setData({
        face_list
      })
      
    })
  },

  newPage () {
    wx.startPullDownRefresh({
      success () {
        console.log('刷新成功');
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getbase64()
    this.hitokoto()
    this.getPhoneInfo()
    // 获取轮播图
    this.getSwiperList()
    // this.getToken()
  },
  // 下拉刷新
  onPullDownRefresh: function () {

  },

})