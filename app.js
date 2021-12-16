App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    if (!wx.cloud) {
      //版本太低，更新到最新版本
      wx.showToast({
        title: "当前基础调试库太低，请更新到最新版本"
      })
    }
    else {
      //云开发初始化
      wx.cloud.init({
        env: "cloud1-3gdnfgxqb4908a6b"
      })
    }
  },
  
})

