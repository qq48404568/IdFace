export const request = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: params.url,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}