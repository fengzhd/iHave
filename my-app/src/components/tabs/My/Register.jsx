import React from 'react'
import { NavBar, Icon, InputItem, Button, Toast } from 'antd-mobile';
import '../../../css/My/Register.min.css'
import CryptoJS  from 'crypto-js'
export default class Register extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '123',
      password: '123',
      confirmPassword: '123'
    }
  }
  render() {
    return(
      <div className="register">
        <div>
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.go("-1")}
          >
            注册
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
              placeholder="****"
              onChange={this.chagePassword}
              value={this.state.password}
            >
              <i className="iconfont">&#xe65e;</i>
            </InputItem>
            <InputItem
              // {...getFieldProps('password')}
              type="password"
              placeholder="请确认密码"
              onChange={this.confirmPassword}
              value={this.state.confirmPassword}
            >
              <i className="iconfont">&#xe65e;</i>
            </InputItem>
            <div className="submit">
              <Button onClick={this.submit}>注册</Button>
            </div>
            <div className="toRegister">
              去登录
            </div>
          </div>
        </div>
        
      </div>
    ) 
  }
  // 改变用户名
  chageUsername =(val) => {
    this.setState({
      username: val
    })
  }
  // 改变密码
  chagePassword =(val) => {
    this.setState({
      password: val
    })
  }
  // 改变确认密码
  confirmPassword = (val) => {
    this.setState({
      confirmPassword: val
    })
  }
  // 提交
  submit = () => {
    let username = this.state.username
    let pwd = this.state.password
    let conpwd = this.state.confirmPassword
    if (username === '') {
      return Toast.info('请输入用户名', 2);
    }
    if (pwd === '') {
      return Toast.info('请输入密码', 2);
    }
    if (conpwd === '') {
      return Toast.info('请确认密码', 2);
    }
    if(pwd !== conpwd) {
      return Toast.info('输入的两次密码不一致', 2);
    }
    // 对密码进行加密
    let key = 'key'
    let encryptPwd = CryptoJS.AES.encrypt(pwd, key).toString()
    
    let data = this.$qs.stringify({
      username: username,
      password: encryptPwd    
    })
    this.$axios.post('/register?',data, ({
      headers: {
        key: key
      }
    })).then(res => {
      let data = res.data
      if(data.status !==  200) {
        return Toast.fail(data.msg, 2);
      }
      Toast.success(data.msg, 2, () => {
        this.props.history.push('/login')
      });
    })


  }
}
