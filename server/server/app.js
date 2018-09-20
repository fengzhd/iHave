const express = require('express')
const app = express()
const path = require('path')
const router = require('./src/router.js')
const bodyParser = require('body-parser')
const session = require('express-session')



app.all("*", function(req, res, next) {

	res.header("Access-Control-Allow-Credentials", true);
	//设置允许跨域的域名，*代表允许任意域名跨域

	if (req.headers.origin && req.headers.origin.toLowerCase() === "http://localhost:3000" ||
		req.headers.origin && req.headers.origin.toLowerCase() === "http://192.168.1.105:3000") {
		//设置允许跨域的域名，*代表允许任意域名跨域
		res.header("Access-Control-Allow-Origin", req.headers.origin);
	}

	// res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	// res.header("Access-Control-Allow-Origin", "http://192.168.1.105:3000");

	//允许的header类型
	res.header("Access-Control-Allow-Headers", "content-type, key");

	//跨域允许的请求方式 
	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
	// if (req.method.toLowerCase() == 'options')
	// 	res.send(200); //让options尝试请求快速结束
	// else
	next();
})


app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
}))



app.use('/public', express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({
	extended: false,
	limit: '10mb'
}))

app.use(bodyParser.json({
	limit: '10mb'
}))
app.use(router)



app.listen(3001, () => {
	console.log('iHave-srver is running on http://127.0.0.1:3001')
})