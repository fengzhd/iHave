const conn = require('../db.js')
const config = require('../baseConfig.js')


// 设置图片路径方法封装
const configImgPath = (data, imgName, path) => {

	data.forEach(item => {
		item[imgName] = `${config.serverUrl}/public/imgs/${config.imgPath[path]}/${item[imgName]}`
	})

}



// 加入购物车
const addToCar = (req, res) => {
	if(!req.session.user) {
		return
	}
	let userId = req.session.user.info.id
	let data = req.body
	data.userId = userId
	data.img = data.img.split('/')
	data.img = data.img[data.img.length - 1]
	let str = ''
	data.imgs.forEach(item => {
		item = item.split('/')
		item = item[item.length - 1]
		str += item + ','
	})
	data.imgs = str.slice(0, str.length - 1)
	data.tags = data.tags.join(',')

	let query = `select userId, size, color, count from shoppingcar where id = ${data.id}`
	conn.query(query, (err, result) => {
		if (err) {
			return res.send({
				msg: '服务器错误',
				status: 500
			})
		}
		if (result.length === 0) {
			let sql = `insert into shoppingcar (id,firstCategoryId,secondCategoryId,name,img,merchant,price,intro,hits,size,color,freight,store,time,isEvent,tags,imgs,count,isSelect,userId) values ('${data.id}','${data.firstCategoryId}','${data.secondCategoryId}','${data.name}','${data.img}','${data.merchant}','${data.price}','${data.intro}','${data.hits}','${data.size}','${data.color}','${data.freight}','${data.store}','${data.time}','${data.isEvent}','${data.tags}','${data.imgs}','${data.count}','${data.isSelect}','${data.userId}')`
			conn.query(sql, (err, result) => {
				if (err) {
					return res.send({
						msg: '服务器错误',
						status: 500
					})
				}
				if (!result.affectedRows === 1) {
					return res.send({
						msg: '服务器错误',
						status: 501
					})
				}
				return res.send({
					msg: '添加成功',
					status: 200
				})
			})

		} else {
			if (result[0].userId === data.userId && result[0].size === data.size && result[0].color === data.color) {
				let count = result[0].count + 1
				let update = `update shoppingcar set count = ${count} where id = ${data.id}`
				conn.query(update, (err, result) => {
					if (err) {
						return res.send({
							msg: '服务器错误',
							status: 500
						})
					}
					if (!result.affectedRows === 1) {
						return res.send({
							msg: '服务器错误',
							status: 501
						})
					}
					return res.send({
						msg: '添加成功',
						status: 200
					})

				})
			} else {
				let sql = `insert into shoppingcar (id,firstCategoryId,secondCategoryId,name,img,merchant,price,intro,hits,size,color,freight,store,time,isEvent,tags,imgs,count,isSelect,userId) values ('${data.id}','${data.firstCategoryId}','${data.secondCategoryId}','${data.name}','${data.img}','${data.merchant}','${data.price}','${data.intro}','${data.hits}','${data.size}','${data.color}','${data.freight}','${data.store}','${data.time}','${data.isEvent}','${data.tags}','${data.imgs}','${data.count}','${data.isSelect}','${data.userId}')`
				conn.query(sql, (err, result) => {
					if (err) {
						return res.send({
							msg: '服务器错误',
							status: 500
						})
					}
					if (!result.affectedRows === 1) {
						return res.send({
							msg: '服务器错误',
							status: 501
						})
					}
					return res.send({
						msg: '添加成功',
						status: 200
					})
				})

			}

		}



	})



}


// 获取购物车信息
const getCarInfo = (req, res) => {
	if (!req.session.user) {
		return
	}
	let userId = req.session.user.info.id
	let sql = `select * from shoppingcar where userId = ${userId}`
	conn.query(sql, (err, result) => {
		if (err) {
			return res.send({
				msg: '服务器错误',
				status: 500
			})
		}
		configImgPath(result, 'img', 'goodsImg')
		res.send({
			msg: '获取成功',
			status: 200,
			result: result
		})
	})

}

// 删除购物车物品
const deleteGoodsFromCar = (req, res) => {
	let tabid = req.params.tabid
	let sql = `delete from shoppingcar where tabid = ${tabid}`
	conn.query(sql, (err, result) => {
		if (err) {
			return res.send({
				msg: '服务器错误',
				status: 500
			})
		}
		if (!result.affectedRows === 1) {
			return res.send({
				msg: '服务器错误',
				status: 501
			})
		}
		return res.send({
			msg: '删除成功',
			status: 200
		})
	})
}

// 修改数量
const updateCount = (req, res) => {
	let tabid = req.params.tabid
	let count = req.params.count
	let sql = `update shoppingcar set count = ${count} where tabid = ${tabid}`
	conn.query(sql, (err, result) => {
		if (err) {
			return res.send({
				msg: '服务器错误',
				status: 500
			})
		}
		if (!result.affectedRows === 1) {
			return res.send({
				msg: '服务器错误',
				status: 501
			})
		}
		return res.send({
			msg: '更新成功',
			status: 200
		})
	})

}


module.exports = {
	addToCar,
	getCarInfo,
	deleteGoodsFromCar,
	updateCount
}