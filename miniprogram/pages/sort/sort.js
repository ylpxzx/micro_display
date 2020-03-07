// pages/sort/sort.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ColorList: app.globalData.ColorList,
    sortinfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this
    wx.cloud.callFunction({
      name: 'getSortList',
      data: {
        openid: wx.getStorageSync("openid")
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        self.setData({
          sortinfo: res.result.mysortinfo.data
        })
        console.log(res.result.mysortinfo.data)
      },
      fail: function (res) {
        wx.stopPullDownRefresh()
        console.log(res.errMsg)
      }
    })
  },



  onShow: function () {
    this.onLoad();
  },

  onPullDownRefresh: function () {
    this.onLoad();
  },


  toaddSort: function (event) {
    wx.navigateTo({
      url: '../addsort/addsort'
    });
  },
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },

  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  }
})
