const conn = require('../db.js')
const config = require('../baseConfig.js')
const moment = require('moment');
const formidable = require('formidable')
const cheerio = require('cheerio')
const fs = require('fs')

// 设置图片路径方法封装
const configImgPath = (data, imgName, path) => {

	data.forEach(item => {
		item[imgName] = `${config.serverUrl}/public/imgs/${config.imgPath[path]}/${item[imgName]}`
	})

}


const getArticle = (req, res) => {
	let nowPage = req.params.nowPage
	let pageSize = req.params.pageSize
	let sql = `select article.*, user.username, user.headerImg from article  left join  user on article.userId = user.id limit ${(nowPage - 1) * pageSize},${pageSize}`
	conn.query(sql, (err, result) => {
		if (err) {
			return res.send({
				msg: '服务器错误',
				status: 500
			})
		}
		result.forEach(item => {
			item.ctime = moment(item.ctime).format('YYYY-MM-DD')
		})
		configImgPath(result, 'headerImg', 'headerImg')
		res.send({
			msg: '获取成功',
			status: 200,
			result: result
		})
	})
}

// 获取全部文章
const getFullText = (req, res) => {
	let id = req.params.id
	let sql = `select article.*, user.username, user.headerImg from article left join user on article.userId = user.id where article.id = ${id}`
	conn.query(sql, (err, result) => {
		if (err) {
			return res.send({
				msg: '服务器错误',
				status: 500
			})
		}
		configImgPath(result, 'headerImg', 'headerImg')
		let arr = []
		result.forEach(item => {
			let data = item.content
			const $ = cheerio.load(data)
			for (var i = 0; i < $('img').length; i++) {
				let imgItem = $('img')[i]
				let src = imgItem.attribs.src
				let url = `${config.serverUrl}/public/imgs/${config.imgPath.articleImgs}/${src}`
				data = data.replace(src, url)

			}
			let date = moment(item.date).format('YYYY-MM-DD')
			item = {
				...item,
				ctime: date,
				content: data
			}
			// console.log(item)
			arr.push(item)
		})

		res.send({
			msg: '获取成功',
			status: 200,
			result: arr
		})
	})
}

// 上传文章
const publishArticle = (req, res) => {
	if (!req.session.user) {
		return
	}
	let title = req.body.title
	let data = req.body.article
	let userId = req.session.user.info.id
	const $ = cheerio.load(data)

	for (var i = 0; i < $('img').length; i++) {
		let item = $('img')[i]
		let baseUrl = item.attribs.src
		let extendName = baseUrl.split(';')[0].split('/')[1]

		let name = Date.now() + '.' + extendName
		var path = './' + '\\' + 'public\\imgs\\articleImgs\\' + name; //从app.js级开始找--在我的项目工程里是这样的
		var base64 = baseUrl.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
		var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
		fs.writeFile(path, dataBuffer, function(err) { //用fs写入文件
			if (err) {
				console.log(err);
			} else {
				console.log('写入成功！');
			}
		})
		$('img')[0].attribs.src = name
		data = data.replace(baseUrl, name)
	}
	let date = new Date()
	date = moment(date).format('YYYY-MM-DD')
	let sql = `insert into article (userId, title, content, ctime) values ('${userId}', '${title}','${data}','${date}')`
	conn.query(sql, (err, result) => {
		if (err) {
			return res.send({
				msg: '服务器错误',
				status: 500
			})
		}
		if (result.affectedRows !== 1) {
			return res.send({
				msg: '服务器错误',
				status: 501
			})
		}
		res.send({
			msg: '发表成功',
			status: 200
		})
	})
}

// 获取我发表的文章
const getMyArticles = (req, res) => {
	if (!req.session.user) {
		return
	}
	let userId = req.session.user.info.id
	let sql = `select * from article where userId = ${userId}`
	conn.query(sql, (err, result) => {
		let arr = []
		result.forEach(item => {
			let data = item.content
			const $ = cheerio.load(data)
			for (var i = 0; i < $('img').length; i++) {
				let imgItem = $('img')[i]
				let src = imgItem.attribs.src
				let url = `${config.serverUrl}/public/imgs/${config.imgPath.articleImgs}/${src}`
				data = data.replace(src, url)

			}
			let date = moment(item.date).format('YYYY-MM-DD')
			item = {
				...item,
				ctime: date,
				content: data
			}
			// console.log(item)
			arr.push(item)
		})

		res.send({
			msg: '获取成功',
			status: 200,
			result: arr
		})
	})
}


// 获取文章详情
const getArticleDetail = (req, res) => {
	let id = req.params.id
	let sql = `select * from article where id = ${id}`
	conn.query(sql, (err, result) => {
		let item = result[0]
		let data = item.content
		const $ = cheerio.load(data)
		for (var i = 0; i < $('img').length; i++) {
			let imgItem = $('img')[i]
			let src = imgItem.attribs.src
			let url = `${config.serverUrl}/public/imgs/${config.imgPath.articleImgs}/${src}`
			data = data.replace(src, url)

		}
		let date = moment(item.date).format('YYYY-MM-DD')
		item = {
			...item,
			ctime: date,
			content: data
		}
		// console.log(item)

		res.send({
			msg: '获取成功',
			status: 200,
			result: item
		})
	})
}
module.exports = {
	getArticle,
	getFullText,
	publishArticle,
	getMyArticles,
	getArticleDetail
}