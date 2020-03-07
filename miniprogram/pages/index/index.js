Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    bloginfo: {},
    userinfo: {},
    daohanlist:['全部'],
    cardCur: 0,
    swiperinfo:[],
  },
  // 导航栏
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getSwiper',
      data: {},
      success: function (res) {
        self.setData({
          swiperinfo: res.result.data.swiperList
        })
      },
      fail: function (res) {
        console.log('轮播错误',res.errMsg)
      }
    })
    wx.cloud.callFunction({
      name: 'getGoods',
      data: {},
      success: function(res) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        self.setData({
          bloginfo: res.result.bloginfo.data,
          userinfo: res.result.userinfo.data
        })
      },
      fail: function(res) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    this.onLoad();
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
  viewItem: function(event) {
    var item = event.currentTarget.dataset.item
    var blogdata = JSON.stringify(item)

    var user = event.currentTarget.dataset.user
    var bloguserdata = JSON.stringify(user)
    wx.navigateTo({
      url: '../blogDetail/blogDetail?blogdata=' + blogdata + '&bloguserdata=' + bloguserdata
    });
  },

  // 轮播
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
})