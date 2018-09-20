const express = require('express')
const router = express.Router()
const getInfo = require('./controllers/getInfo.js')
const user = require('./controllers/user.js')
const shoppingCar = require('./controllers/shoppingCar.js')
const article = require('./controllers/article.js')



// 获取轮播图广告
router.get('/getAdvertising', getInfo.getAdvertising)

// 获取首页推荐数据
router.get('/getRecommendListData/:title/:page/:pageSize', getInfo.getRecommendListData)

// 获取首页分类详情
router.get('/getCategoryDetail/:title', getInfo.getCategoryDetail)

// 获取详情页热门活动信息
router.get('/getHotActivitie/:title', getInfo.getHotActivitie)

// 获取详情页欲望清单信息
router.get('/getDesireList/:title', getInfo.desireList)

// 获取详情页推荐列表
router.get('/getCategoryDetailList/:title/:nowList/:nowPage/:pageSize', getInfo.getCategoryDetailList)

// 获取热词

router.get('/getHotTest/:title', getInfo.getHotTest)

// 获取二级分类信息
router.get('/getCategoryDetailCatList/:title/:nowListFirstTitle/:nowListSecondTitle/:nowPage/:pageSize', getInfo.getCategoryDetailCatList)

//获取商品全部信息

router.get('/getGoodsDetail/:id', getInfo.getGoodsDetail)



// 注册
router.post('/register', user.register)

// 获取用户登录数据
router.get('/getUserInfo', user.getUserInfo)


// 登录
router.post('/login', user.login)

// 注销
router.get('/logout', user.logout)

//上传头像
router.post('/uploadingHeader', user.uploadingHeader)

//上传性别
router.get('/uploadingGender/:gender', user.uploadingGender)

//上传性别
router.get('/uploadingAge/:age', user.uploadingAge)

// 修改密码
router.post('/modifyPassword', user.modifyPassword)

// 加入购物车
router.post('/addToCar', shoppingCar.addToCar)
// 获取购物车信息
router.get('/getCarInfo', shoppingCar.getCarInfo)
// 删除购物车物品
router.get('/deleteGoodsFromCar/:tabid', shoppingCar.deleteGoodsFromCar)
// 删除购物车物品
router.get('/updateCount/:tabid/:count', shoppingCar.updateCount)


// 获取社区文章信息
router.get('/getArticle/:nowPage/:pageSize', article.getArticle)
// 获取文章全部信息
router.get('/getFullText/:id', article.getFullText)

// 上传文章
router.post('/publishArticle', article.publishArticle)

// 获取我发表的文章
router.get('/getMyArticles', article.getMyArticles)
// 获取文章详情
router.get('/getArticleDetail/:id', article.getArticleDetail)

module.exports = router