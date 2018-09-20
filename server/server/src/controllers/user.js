const conn = require('../db.js')
const config = require('../baseConfig.js')
const CryptoJS = require('crypto-js')
const formidable = require('formidable')
const path = require('path')
const moment = require('moment');
const fs = require('fs')

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

// 注册
const register = (req, res) => {
	let body = req.body
	let username = body.username
	let password = body.password
	let key = req.headers.key

	let selSql = `select count(*) as count from user where username='${username}'`

	conn.query(selSql, (err, result) => {

		if (err) {
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
		msg: '请登录',
		status: 500,
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
	if (!req.session.user) {
		return
	}
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

// 修改性别
const uploadingGender = (req, res) => {
	if(!req.session.user) {
		return
	}
	let gender = req.params.gender
	let id = req.session.user.info.id
	let sql = `update user set gender = ${gender} where id = ${id}`
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
		let sql = `select * from user where id = ${id}`
		conn.query(sql, (err, result) => {
			let obj = sendUserInfo(req, result)

			req.session.user = obj

			return res.send({
				msg: '修改成功',
				status: 200,
				result: obj
			})
		})

	})

}

// 修改年龄
const uploadingAge = (req, res) => {
	if(!req.session.user) {
		return
	}
	let age = req.params.age
	let id = req.session.user.info.id
	let sql = `update user set age = ${age} where id = ${id}`
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
		let sql = `select * from user where id = ${id}`
		conn.query(sql, (err, result) => {
			let obj = sendUserInfo(req, result)

			req.session.user = obj

			return res.send({
				msg: '修改成功',
				status: 200,
				result: obj
			})
		})

	})
}

// 修改密码
const modifyPassword = (req, res) => {
	if (!req.session.isLogin) {
		return
	}
	let encryptOldPwd = req.body.oldPassword
	let encryptNewPwd = req.body.newPassword
	let pwdKey = req.headers.key
	let id = req.session.user.info.id

	let sql = `select password from user where id = ${id}`
	conn.query(sql, (err, result) => {
		if (err) {
			return res.send({
				msg: '服务器错误',
				status: 500
			})
		}
		if (result.length === 0) {
			return res.send({
				msg: '用户不存在',
				status: 501
			})
		}
		let encryptSqlPwd = result[0].password
		// 解密数据库旧密码
		let SqlPwd = CryptoJS.AES.decrypt(encryptSqlPwd, config.serverPwdKey);
		let SqlPwdText = SqlPwd.toString(CryptoJS.enc.Utf8);
		// 解密传输过来的旧密码
		let oldPwd = CryptoJS.AES.decrypt(encryptOldPwd, pwdKey);
		let oldPwdText = oldPwd.toString(CryptoJS.enc.Utf8);
		if (SqlPwdText !== oldPwdText) {
			return res.send({
				msg: '原密码错误',
				status: 503
			})
		}
		// 解密传输过来的新密码
		let newPwd = CryptoJS.AES.decrypt(encryptNewPwd, pwdKey);
		let newPwdText = newPwd.toString(CryptoJS.enc.Utf8);
		// 加密传输过来的新密码
		let encryptPwd = CryptoJS.AES.encrypt(newPwdText, config.serverPwdKey).toString()
		let sql = `update user set password = '${encryptPwd}' where id = ${id}`
		conn.query(sql, (err, result) => {
			if (err) {
				return res.send({
					msg: '服务器错误',
					status: 504
				})
			}
			if (result.affectedRows !== 1) {
				return res.send({
					msg: '服务器错误',
					status: 505
				})
			}
			req.session.destroy()
			return res.send({
				msg: '修改成功',
				status: 200
			})
		})
	})
}



module.exports = {
	register,
	getUserInfo,
	login,
	logout,
	uploadingHeader,
	uploadingGender,
	uploadingAge,
	modifyPassword
}