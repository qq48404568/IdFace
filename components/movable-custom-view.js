// components/movable-custom-view/movable-custom-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    moveViewHeight: {
      type: String,
      value: 0
    },
    moveViewX: {
      type: Number,
      value: 0
    },
    moveViewY: {
      type: Number,
      value: 0
    }
  },

  externalClasses: ['custom-class'],
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onHome:function(){
      wx.reLaunch({
        url: '/pages/index/index',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  }
})