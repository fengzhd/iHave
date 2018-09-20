import React from 'react';
import ReactDOM from 'react-dom';
// import 'amazeui-touch/dist/amazeui.touch.min.css';
import './css/Base/normalize.css';
import './assets/fonts/iconfont.css'
import './css/Base/base.css'
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios'
import qs from 'qs'
// 引入redux
import { createStore } from 'redux'
import { Provider } from 'react-redux'

// 引入reducer
import reducer from './reducers'

const $axios = axios.create({
  //  baseURL: 'http://127.0.0.1:3001/',
   baseURL: 'http://192.168.1.105:3001/',
  // 配置携带跨域访问
  withCredentials: true
   
});

React.Component.prototype.$axios = $axios
React.Component.prototype.$qs = qs

var initState = {
  user: {
    info: {},
    isLogin: false
  }
}
// 先发送请求判断是否登录再渲染页面
$axios.get('/getUserInfo').then(res=> {
  let data = res.data
  if(data.status === 500) {
    initState = {
      user: {
        info: {},
        isLogin: false
      }
    }
  } else {
    initState = {
      user: {
        info: data.user.info,
        isLogin: data.user.isLogin
      }
    }
  }
  // 创建store
  const store = createStore(reducer, initState, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

  ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
  registerServiceWorker();
})
