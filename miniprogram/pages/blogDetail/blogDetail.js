// pages/blogDetail/blogDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogdata: {},
    bloguserdata: {},
    commentinfo: {},
    commentuserinfo: {},
    isHavaCollect: false,
    myopenid: wx.getStorageSync("openid"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    self.setData({
      blogdata: JSON.parse(options.blogdata),
      bloguserdata: JSON.parse(options.bloguserdata)
    })
    wx.setNavigationBarTitle({
      title: JSON.parse(options.blogdata).title
    })
    wx.cloud.callFunction({
      name: 'isCollect',
      data: {
        blogid: self.data.blogdata._id,
        openid: wx.getStorageSync("openid")
      },
      success: function(res) {
        self.setData({
          isHavaCollect: res.result.isHavaCollect
        })
        console.log(res.result.isHavaCollect)
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },
  look_image: function (e) {
    wx.previewImage({
      //当前显示下
      current: e.currentTarget.dataset.item,
      //数据源
      urls: this.data.blogdata.picture
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onCollect: function() {
    self = this
    console.log(self.data.isHavaCollect)
    wx.showLoading({
      title: '加载中',
    })
    if (self.data.isHavaCollect == true) {
      wx.cloud.callFunction({
        name: 'deleteCollect',
        data: {
          blogid: self.data.blogdata._id,
          openid: wx.getStorageSync("openid")
        },
        success: function(res) {
          console.log(res)
          if (res.result.msg == 'ok') {
            wx.showToast({
              icon: 'none',
              title: '取消收藏成功',
            })
            self.setData({
              isHavaCollect: false
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '取消收藏失败',
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'addCollect',
        data: {
          blogid: self.data.blogdata._id,
          openid: wx.getStorageSync("openid")
        },
        success: function(res) {
          console.log(res)
          if (res.result.msg == 'ok') {
            wx.showToast({
              icon: 'none',
              title: '收藏成功',
            })
            self.setData({
              isHavaCollect: true
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '收藏失败',
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }

  },
})