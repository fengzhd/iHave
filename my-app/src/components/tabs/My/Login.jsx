import React from 'react'
import {  connect } from 'react-redux'
import CryptoJS  from 'crypto-js'

import { NavBar, Icon, InputItem, Button, Toast } from 'antd-mobile';
import '../../../css/My/Login.min.css'
 class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '123',
      password: '123'
    }
  }
  render() {
    return(
      <div className="login">
        <div>
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.go("-1")}
          >
            登录
          </NavBar>
        </div>
        <div className="content">
          <div>
            <InputItem
              // {...getFieldProps('password')}
              placeholder="请输入用户名"
              onChange={this.chageUsername}
              value={this.state.username}
            >
              <i className="iconfont">&#xe801;</i>
            </InputItem>
            <InputItem
              // {...getFieldProps('password')}
              type="password"
              placeholder="请输入密码"
              onChange={this.chagePassword}
              value={this.state.password}
            >
              <i className="iconfont">&#xe65e;</i>
            </InputItem>
            <div className="submit">
              <Button onClick={this.submit}>登录</Button>
            </div>
            <div className="toRegister">
              去注册
            </div>
          </div>

          <div className="otherLogin">
            <h4>第三方登录</h4>
            <div className="item">
              <div className="wx">
                <i className="iconfont">&#xe73b;</i>
                微信登录
              </div>
              <div className="qq">
                <i className="iconfont">&#xe73e;</i>
                qq登录
              </div>
              <div className="wb">
                <i className="iconfont">&#xe73c;</i>
                微博登录
              </div>
            </div>
          </div>
        </div>
      </div>
    ) 
  }
  chageUsername =(val) => {
    this.setState({
      username: val
    })
  }
  chagePassword =(val) => {
    this.setState({
      password: val
    })
  }
  submit = () => {
    let username = this.state.username
    let password = this.state.password
    if (username === '') {
      return Toast.fail('请输入用户名', 2);
    }
    if (password === '') {
      return Toast.fail('请输入密码', 2);
    }
    // 密码加密
    let key = 'key'
    let encryptPwd = CryptoJS.AES.encrypt(password, key).toString()
    let data = this.$qs.stringify({
      username: username,
      password: encryptPwd    
    })
    this.$axios.post('/login', data, ({
      headers: {
        key: key
      }
    })).then(res => {
      let data = res.data
      if(data.status !== 200) {
        return Toast.fail(data.msg, 2);
      }
      // 调用redux存储用户信息
      this.props.setUserInfo(data.result)
      Toast.success(data.msg, 1, () => {
        this.props.history.push('/tab/my')
      });
    })
  }
}






function mapDispatchToProps(dispatch) {
  return {
    setUserInfo (data) {
      dispatch({
        type: 'SET_USER_INFO',
        data: data
      })
    }
  }
}

export default connect(null,mapDispatchToProps)(Login)