// pages/myBlog/myBlog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bloginfo: [],
    userinfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    wx.cloud.callFunction({
      name: 'getMyGoodsList',
      data: {
        openid: wx.getStorageSync("openid")
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        self.setData({
          bloginfo: res.result.mybloginfo.data,
          userinfo: res.result.mybloguserinfo.data
        })
      },
      fail: function(res) {
        wx.stopPullDownRefresh()
        console.log(res.errMsg)
      }
    })
  },


  onShow: function() {
    this.onLoad();
  },


  onPullDownRefresh: function() {
    this.onLoad();
  },

  viewItem: function(event) {
    if (this.endTime - this.startTime < 350) {
      var item = event.currentTarget.dataset.item
      var blogdata = JSON.stringify(item)

      var user = event.currentTarget.dataset.user
      var bloguserdata = JSON.stringify(user)
      wx.navigateTo({
        url: '../blogDetail/blogDetail?blogdata=' + blogdata + '&bloguserdata=' + bloguserdata
      });
    }
  },
  publish: function(event) {
    wx.navigateTo({
      url: '../publish/publish'
    });
  },
  onDeleteBlog: function(event) {
    var blogdata = event.currentTarget.dataset.item
    var blogindex = event.currentTarget.dataset.index
    console.log(blogdata.title)
    self = this

    wx.showModal({
      title: '提示',
      content: '确认删除?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          wx.cloud.callFunction({
            name: 'deleteGoods',
            data: {
              blogid: blogdata._id
            },
            success: function(res) {
              console.log(res)
              if (res.result.msg == 'ok') {
                wx.cloud.deleteFile({
                  fileList: blogdata.picture,
                  success: res => {
                    wx.showToast({
                      icon: 'none',
                      title: '删除成功',
                    })
                    self.data.bloginfo.splice(blogindex, 1)
                    self.data.userinfo.splice(blogindex, 1)
                    self.setData({
                      bloginfo: self.data.bloginfo,
                      userinfo: self.data.userinfo
                    })
                  },
                  fail: console.error
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '删除失败',
                })
              }
            },
            fail: function(res) {
              console.log(res)
            }
          })



        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },

  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  }
})