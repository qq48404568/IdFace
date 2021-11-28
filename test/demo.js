/*
 * @Description:
 * @Author: RyangXie
 * @Date: 2021-11-28 10:28:53
 * @LastEditTime: 2021-11-28 10:28:53
 * @LastEditors: RyangXie
 * @Reference:
 */

var fileSystem = wx.getFileSystemManager();

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: ''
  },
  //选择照片
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
        this.getBase64(res.tempFilePaths[0])
      }
    })
  },
//图片转base64位方法
  getBase64:function (filePath) {
    // console.log(fileSystem);
    const fileSystem = wx.getFileSystemManager();
    fileSystem.readFile({
      filePath,
      encoding:"base64",
      success:res=>{
        // console.log(res.data);
        this.getToken(res.data);
      }
    })
},

getToken:function (base) {
  wx.request({
    //请求地址
    url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=IC2e1TTC7zuVQDDGWfGQR7cN&client_secret=vQuE4EU2UjphKGjOMEGLxuQ8EFjTMgys',
    //请求方式
    method:"POST",
    //请求参数
    data:{
      	
      // //固定值
      // grant_type:"client_credentials",
      // //api key参数
      // client_id:"IC2e1TTC7zuVQDDGWfGQR7cN",
      // //Secret Key
      // client_secret:"vQuE4EU2UjphKGjOMEGLxuQ8EFjTMgys"
    },
    //如果接口调用成功
    success:res=>{
      console.log(res.data.refresh_token);
      this.getFaceInfo(res.data.access_token,base)
    }
  })
},

//通过token调用人脸识别接口
getFaceInfo:function (token,base) {
  wx.request({
    url: "https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token="+token,
    method:"POST",
    header:{
      "Content-Type":"application/json"
    },
    data:{
      img:base,
      image_type:"BASE64",
      
    },
    success:res=>{
      console.log(res);
    },
    fail:err=>console.error(err)
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    wx.getSystemInfo({
      // success: (){} 同等于 success:function name(params) {}

      success: (res) => {
        console.log(res);

        console.log(res.brand);
        console.log(res.system);
        console.log(res.model);
        console.log(res.benchmarkLevel);

        this.setData({
          b: res.brand,
          s: res.system,
          m: res.model,
          bl: res.benchmarkLevel
        })
      }
      
    })

    // this.suibian() ;

  },
})