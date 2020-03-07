// pages/publish/publish.js
var timeUtil = require('../../utils/timeUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sort_value:'',
    index: null,
    imgList: [],
    textInput: '',
    textareaInput: '',
    picker: [],
    mypicture:[],
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value,
      sort_value: this.data.picker[e.detail.value]
    })
    console.log('分类选择：', this.data.picker[e.detail.value])
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
        // console.log(res.result.mysortinfo.data)
        for (var i in res.result.mysortinfo.data){
          // console.log(res.result.mysortinfo.data[i].sort_v)
          self.setData({
            picker: self.data.picker.concat(res.result.mysortinfo.data[i].sort_v)
          })
        }
      },
      fail: function (res) {
        wx.stopPullDownRefresh()
        console.log(res.errMsg)
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
  ChooseImage() {
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
          console.log('已选择图片1：',this.data.imgList)
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
          console.log('已选择图片0：', this.data.imgList)
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textInput(e) {
    this.setData({
      textInput: e.detail.value
    })
  },
  textareaInput(e) {
    this.setData({
      textareaInput: e.detail.value
    })
  },
  publishBt: function() {
    const mytitle = this.data.textInput
    const mycontent = this.data.textareaInput
    const mysort=this.data.sort_value
    const mydatetime = timeUtil.formatTime(new Date());
    if (mytitle == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入标题',
      })
      return
    }
    if (mycontent == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入内容',
      })
      return
    }
    if (mysort == '') {
      wx.showToast({
        icon: 'none',
        title: '请选择分类',
      })
      return
    }
    if (this.data.imgList.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择图片',
      })
      return
    }
    wx.showLoading({
      title: '发布中',
    })
    // 上传图片
    for (var i in this.data.imgList){
      const filePath= this.data.imgList[i]
      const cloudPath = (Math.random() * 1000000) + "" + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success:res=>{
          console.log('上传图片',i,' 成功：', res)
          this.setData({
            mypicture: this.data.mypicture.concat(res.fileID)
          })
          console.log('云端图片链接列表0：', res.fileID, this.data.mypicture)
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传图片失败',
          })
        },
      })
    }
    setTimeout(() => {
      wx.cloud.callFunction({
        name: 'addgoods',
        data: {
          datetime: mydatetime,
          content: mycontent,
          sort_value: mysort,
          openid: wx.getStorageSync("openid"),
          picture: this.data.mypicture,
          title: mytitle
        },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  url: '../myBlog/myBlog'
                })
              }, 2000);
            }
          })
        },
        fail: function (res) {
          console.log(res)
          wx.showToast({
            icon: 'none',
            title: '发布失败',
          })
        },
        complete: () => {
          wx.hideLoading()
        }
      },)
    }, 4000)
  }
})