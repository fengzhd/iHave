const conn = require('./db.js')
const config = require('./baseConfig.js')
const CryptoJS = require('crypto-js')
const formidable = require('formidable')
const path = require('path')
const moment = require('moment');
const fs = require('fs')

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

// 返回用户数据方法封装

const sendUserInfo = (req, result) => {
	let obj = {
		isLogin: req.session.isLogin,
		info: {}
	}
	for (var key in result[0]) {
		if (key === 'password') {
			continue
		}
		if (key === 'headerImg') {
			result[0][key] = `${config.serverUrl}/public/imgs/${config.imgPath['headerImg']}/${result[0][key]}`
		}
		obj.info[key] = result[0][key]
	}
	return obj
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
		configImgPath(result, 'img', 'goodsImg')
		sendResult(res, err, result)
	})
}

// 注册
const register = (req, res) => {
	let body = req.body
	let username = body.username
	let password = body.password
	let key = req.headers.key

	let selSql = `select count(*) as count from user where username='${username}'`

	conn.query(selSql, (err, result) => {

		if (err) {
			console.log(err)
			return res.send({
				msg: '服务器错误',
				status: 500
			})
		}
		if (result[0].count >= 1) {
			return res.send({
				msg: '用户名被占用',
				status: 501
			})
		}
		// 解密
		let bytes = CryptoJS.AES.decrypt(password, key);
		let plaintext = bytes.toString(CryptoJS.enc.Utf8);
		// 加密
		let encryptPwd = CryptoJS.AES.encrypt(plaintext, config.serverPwdKey).toString()

		password = encryptPwd
		let sql = `insert into user set username = '${username}',password='${password}'`
		conn.query(sql, (err, result) => {
			if (err) {
				console.log(err)
				return res.send({
					msg: '服务器错误',
					status: 502
				})
			}
			if (result.affectedRows !== 1) {
				return res.send({
					msg: '服务器错误',
					status: 501
				})
			}
			if (result.affectedRows === 1) {
				return res.send({
					msg: '注册成功',
					status: 200
				})
			}
		})
	})
}

// 登录
const login = (req, res) => {
	let body = req.body
	let username = body.username
	let password = body.password
	let pwdKey = req.headers.key

	let sql = `select * from user where username = '${username}'`
	conn.query(sql, (err, result) => {
		if (err) {
			return res.send({
				msg: '服务器错误',
				status: 500
			})
		}
		if (result.length === 0) {
			return res.send({
				msg: '用户名不存在',
				status: 501
			})
		}

		// 解密传输过来的密码
		let formBytes = CryptoJS.AES.decrypt(password, pwdKey);
		let formPlaintext = formBytes.toString(CryptoJS.enc.Utf8);

		// 解密数据库中的密码
		let encryptPwd = result[0].password
		let bytes = CryptoJS.AES.decrypt(encryptPwd, config.serverPwdKey);
		let plaintext = bytes.toString(CryptoJS.enc.Utf8);
		if (formPlaintext !== plaintext) {
			return res.send({
				msg: '用户名或密码错误',
				status: 502
			})
		}

		req.session.isLogin = true

		// let obj = {
		// 	isLogin: req.session.isLogin,
		// 	info: {}
		// }
		// for (var key in result[0]) {
		// 	if (key === 'password') {
		// 		continue
		// 	}
		// 	if (key === 'headerImg') {
		// 		result[0][key] = `${config.serverUrl}/public/imgs/${config.imgPath['headerImg']}/${result[0][key]}`
		// 	}
		// 	obj.info[key] = result[0][key]
		// }
		let obj = sendUserInfo(req, result)

		req.session.user = obj

		res.send({
			msg: '登录成功',
			status: 200,
			result: obj,

		})


	})

}

// 获取用户登录数据

const getUserInfo = (req, res) => {
	if (req.session.isLogin) {
		return res.send({
			user: req.session.user,
		})
	}
	res.send({
		msg: '请登录'
	})

}

// 注销登录
const logout = (req, res) => {
	req.session.destroy()
	res.send({
		msg: '注销成功',
		status: 200
	})
}

//上传头像
const uploadingHeader = (req, res) => {
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';
	form.uploadDir = "./public/imgs/userHeader";
	form.keepExtensions = true;
	let oldpath = ''
	let newpath = ''
	form.parse(req, function(err, fields, files) {
		let id = req.session.user.info.id
		let name = files.file.name
		let extname = path.extname(name)
		let timestamp = new Date().getTime()
		let newName = id + '_' + timestamp + extname
		oldpath = './' + '\\' + files.file.path
		newpath = './' + '\\' + 'public\\imgs\\userHeader\\' + newName

		oldpath = oldpath.replace(/\\/g, '/')
		newpath = newpath.replace(/\\/g, '/')

		fs.rename(oldpath, newpath, function(err) {
			if (err) {
				return res.send({
					msg: '服务器错误',
					status: 500
				})
			}
			let sql = `update user set headerImg = '${newName}'  where id = ${id}`
			conn.query(sql, (err, result) => {
				if (result.affectedRows !== 1) {
					return res.send({
						msg: '服务器错误',
						status: 501
					})
				} else {
					let backSql = `select * from user where id = ${id}`
					conn.query(backSql, (err, result) => {



						// let obj = {
						// 	isLogin: req.session.isLogin,
						// 	info: {}
						// }
						// for (var key in result[0]) {
						// 	if (key === 'password') {
						// 		continue
						// 	}
						// 	if (key === 'headerImg') {
						// 		result[0][key] = `${config.serverUrl}/public/imgs/${config.imgPath['headerImg']}/${result[0][key]}`
						// 	}
						// 	obj.info[key] = result[0][key]
						// }


						let obj = sendUserInfo(req, result)

						req.session.user = obj



						return res.send({
							msg: '修改成功',
							status: 200,
							result: obj
						})
					})

				}
			})
		});


	});

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
	getGoodsDetail,
	register,
	getUserInfo,
	login,
	logout,
	uploadingHeader
}