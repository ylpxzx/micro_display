// 云函数入口文件
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var myopenid = event.openid
  var mysort = event.sort_v
  var mycolor = event.color_value
  try {
    return await db.collection('sort').add({
      data: {
        openid: myopenid,
        sort_v: mysort,
        color: mycolor
      }
    })
  } catch (e) {
    console.log(e)
  }
}