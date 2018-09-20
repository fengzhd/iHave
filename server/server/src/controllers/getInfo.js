const conn = require('../db.js')
const config = require('../baseConfig.js')



// 默认返回格式方法封装
const sendResult = (res, err, result, errMsg = '服务器错误', errStatus = 500, sucMsg = '请求成功', sucStatus = 200) => {
	if (err) {
		return res.send({
			"msg": errMsg,
			"status": errStatus
		})
	}
	res.send({
		"msg": sucMsg,
		"status": sucStatus,
		"result": result
	})
}


// 设置图片路径方法封装
const configImgPath = (data, imgName, path) => {

	data.forEach(item => {
		item[imgName] = `${config.serverUrl}/public/imgs/${config.imgPath[path]}/${item[imgName]}`
	})

}


// 获取轮播广告信息
const getAdvertising = (req, res) => {
	let sql = 'select * from advertising'
	conn.query(sql, (err, result) => {
		configImgPath(result, 'imgPath', 'advertisingImgs')
		sendResult(res, err, result)
	})
}


// 获取推荐列表数据
const getRecommendListData = (req, res) => {
	let title = req.params.title
	let page = req.params.page
	let pageSize = req.params.pageSize
	let sql = ''
	if (title === '推荐') {
		sql = `select * from goods order by rand() limit ${pageSize}`
	} else {
		sql = `select goods.* from category_goods left join goods on category_goods.firstCategoryId=goods.firstCategoryId where category_goods.categoryName=? order by rand() limit ${(page - 1) * pageSize},${pageSize}`
	}
	conn.query(sql, title, (err, result) => {
		configImgPath(result, 'img', 'goodsImg')
		sendResult(res, err, result)
	})

}


// 获取首页分类详情
const getCategoryDetail = (req, res) => {
	let title = req.params.title
	// let sql = `select * from category_goods where categoryName = '篮球'`
	let sql = `select * from category_goods where firstCategoryId=(select firstCategoryId from category_goods where categoryName='${title}') and secondCategoryId != 'null'`
	conn.query(sql, (err, result) => {
		configImgPath(result, 'icon', 'icon')
		sendResult(res, err, result)
	})
}


// 获取详情页热门活动信息
const getHotActivitie = (req, res) => {
	let title = req.params.title
	let sql = `select * from activitie where categoryId = (select firstCategoryId from category_goods where categoryName = '${title}') order by ctime desc  limit 3`
	conn.query(sql, (err, result) => {
		configImgPath(result, 'img', 'activitieImgs')
		sendResult(res, err, result)
	})
}


// 获取详情页欲望清单信息
const desireList = (req, res) => {
	let title = req.params.title
	let sql = `select * from desirelist where categoryId = (select firstCategoryId from category_goods where categoryName = '${title}')`
	conn.query(sql, (err, result) => {
		configImgPath(result, 'img', 'desireListImgs')
		sendResult(res, err, result)
	})
}


// 获取详情页推荐列表
const getCategoryDetailList = (req, res) => {
	let nowList = req.params.nowList
	let title = req.params.title
	let nowPage = req.params.nowPage
	let pageSize = req.params.pageSize
	let sql = ''
	if (nowList === 'all') {
		sql = `select  goods.* from goods left join category_goods on category_goods.firstCategoryId = goods.firstCategoryId where category_goods.categoryName = '${title}' limit ${(nowPage - 1) * pageSize}, ${pageSize}`
	}
	if (nowList === 'single') {
		sql = `select  goods.* from goods left join category_goods on category_goods.firstCategoryId = goods.firstCategoryId where category_goods.categoryName = '${title}' order by rand() limit ${(nowPage - 1) * pageSize}, ${pageSize}`

	}
	conn.query(sql, (err, result) => {
		if (err) {
			return
		}
		configImgPath(result, 'img', 'goodsImg')
		sendResult(res, err, result)
	})
}


// 获取热词
const getHotTest = (req, res) => {
	let title = req.params.title
	let sql = `select * from hottest where categoryId = (select firstCategoryId from category_goods where categoryName = '${title}')`
	conn.query(sql, (err, result) => {
		sendResult(res, err, result)
	})
}


// 获取二级分类页面信息
const getCategoryDetailCatList = (req, res) => {
	let nowListFirstTitle = req.params.nowListFirstTitle
	let nowListSecondTitle = req.params.nowListSecondTitle
	let priceArr = nowListSecondTitle.split('-')
	let minPrice = ''
	let maxPrice = ''
	if (priceArr.length > 1) {
		minPrice = priceArr[0]
		maxPrice = priceArr[1]
	}
	let title = req.params.title
	let nowPage = req.params.nowPage
	let pageSize = req.params.pageSize
	let sql = ''
	let orderBy = ''
	let role = ''
	switch (nowListFirstTitle) {
		case '人气最高':
			orderBy = 'hits'
			role = 'desc'
			break;
		case '新品上架':
			orderBy = 'time'
			role = 'asc'
			break;
		case '价格由高到底':
			orderBy = 'price'
			role = 'desc'
			break;
		case '价格由低到高':
			orderBy = 'price'
			role = 'asc'
			break;
	}
	if (nowListSecondTitle === '全部价格') {
		sql = `select * from goods where secondCategoryId = (select secondCategoryId from category_goods where categoryName = '${title}') and firstCategoryId = (select firstCategoryId from category_goods where categoryName = '${title}') ORDER BY  ${orderBy} ${role} limit ${(nowPage - 1) * pageSize}, ${pageSize}`
	} else {
		sql = `select * from (select * from goods where secondCategoryId = (select secondCategoryId from category_goods where categoryName = '${title}') and firstCategoryId = (select firstCategoryId from category_goods where categoryName = '${title}')) as t1 where t1.price between ${minPrice} and ${maxPrice} ORDER BY  ${orderBy} ${role} limit ${(nowPage - 1) * pageSize}, ${pageSize}`
	}

	conn.query(sql, (err, result) => {
		if (err) {
			return
		}
		configImgPath(result, 'img', 'goodsImg')
		sendResult(res, err, result)
	})

}


// 获取商品详细信息
const getGoodsDetail = (req, res) => {
	let id = req.params.id
	let sql = `select * from goods where id = ${id}`
	conn.query(sql, (err, result) => {
		if (err) {
			return
		}
		result[0].imgs = result[0].imgs.split(',')
		for (var i = 0; i < result[0].imgs.length; i++) {
			let item = result[0].imgs[i]
			result[0].imgs[i] = `${config.serverUrl}/public/imgs/${config.imgPath.goodsImg}/${item}`
		}
		configImgPath(result, 'img', 'goodsImg')
		sendResult(res, err, result)
	})
}



module.exports = {
	getAdvertising,
	getRecommendListData,
	getCategoryDetail,
	getHotActivitie,
	desireList,
	getCategoryDetailList,
	getHotTest,
	getCategoryDetailCatList,
	getGoodsDetail
}