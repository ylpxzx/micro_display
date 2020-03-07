// pages/addsort/addsort.js
Page({

  data: {
    index: null,
    sortInput: '',
    color_value:'',
    ColorList: [ 'red','orange', 'yellow', 'olive','green', 'cyan','blue','purple','mauve','pink','brown', 'grey','gray', 'black','white'],
  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value,
      color_value: this.data.ColorList[e.detail.value]
    })
    console.log('颜色选择：', this.data.ColorList[e.detail.value])
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

textInput(e) {
    this.setData({
      sortInput: e.detail.value
    })
  },
  publishBt: function () {
    const mysort = this.data.sortInput
    const color=this.data.color_value
    if (mysort == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入类别名',
      })
      return
    }
    wx.showLoading({
      title: '添加中',
    })
      wx.cloud.callFunction({
        name: 'addsort',
        data: {
          openid: wx.getStorageSync("openid"),
          sort_v: mysort,
          color_value:color
        },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  url: '../sort/sort'
                })
              }, 2000);
            }
          })
        },
        fail: function (res) {
          console.log(res)
          wx.showToast({
            icon: 'none',
            title: '添加失败',
          })
        },
        complete: () => {
          wx.hideLoading()
        }
      })
  }
})