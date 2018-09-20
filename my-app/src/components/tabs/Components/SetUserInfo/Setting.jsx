import React from 'react'
import { NavBar, Icon, InputItem, Toast, Button } from 'antd-mobile';
import CryptoJS  from 'crypto-js'
import {  connect } from 'react-redux'

class Setting extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hasError: false,
      value: '',
      isGetCaptcha: false,
      sec: 10,
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: ''
    }
  }

  onErrorClick = () => {
    if (this.state.hasError) {
      Toast.info('Please enter 11 digits');
    }
  }

  onChange = (value) => {
    if (value.replace(/\s/g, '').length < 11) {
      this.setState({
        hasError: true,
      });
    } else {
      this.setState({
        hasError: false,
      });
    }
    this.setState({
      value,
    });
  }


  render() {
    return(
      <div>
        <div>
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.go("-1")}
          >
            修改{this.props.match.params.title}
          </NavBar>
        </div>
        {
          (() => {
            if(this.props.match.params.title === '手机号码') {
              return(
                <div style={{marginTop: 5}}>
                  <InputItem
                      type="phone"
                      placeholder="请输入新手机号"
                      error={this.state.hasError}
                      onErrorClick={this.onErrorClick}
                      onChange={this.onChange}
                      value={this.state.value}
                  >手机号码</InputItem>
                
                  <div style={{display: 'flex', margin: '5px 0 20px 0', backgroundColor: '#fff'}}>
                    <div style={{flex: '3', marginRight: 5}}>
                      <InputItem
                          placeholder="请输入验证码"
                          ref={el => this.labelFocusInst = el}
                      >
                      </InputItem>
                    </div>
                    <div style={{flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: this.state.isGetCaptcha ? '#ccc' : ''}} onClick={this.getCaptcha}>
                      {this.state.isGetCaptcha ? this.state.sec+'秒后重新获取' : '获取验证码'}
                    </div>
                  </div>
                  <Button>提交</Button>
                </div>
              )
            } else {
              return(
                <div style={{marginTop: 5}}>
                    <InputItem
                    type="password"
                    placeholder="请输入原密码"
                    value={this.state.oldPassword}
                    ref={el => this.labelFocusInst1 = el}
                    onChange={this.inputOldPassword}
                  >
                    <div onClick={() => this.labelFocusInst1.focus()}>
                      原密码
                    </div>
                  </InputItem>
                  <InputItem
                    type="password"
                    placeholder="请输入新密码"
                    value={this.state.newPassword}
                    ref={el => this.labelFocusInst2 = el}
                    onChange={this.inputNewPassword}
                  >
                    <div onClick={() => this.labelFocusInst2.focus()}>
                      新密码
                    </div>
                  </InputItem>
                  <InputItem
                    type="password"
                    placeholder="请再次输入新密码"
                    value={this.state.newPasswordAgain}
                    ref={el => this.labelFocusInst3 = el}
                    onChange={this.inputNewPasswordAgain}
                  >
                    <div onClick={() => this.labelFocusInst3.focus()}>
                      新密码
                    </div>
                  </InputItem>
                  <div style={{marginTop: 5}}>
                    <Button onClick={this.submit}>确认修改</Button>
                  </div>
                </div>
              )
            }
          })()
        }
        
      </div>
    ) 
  }
  // 点击获取验证码
  getCaptcha =() => {
    if(this.state.isGetCaptcha) {
      return
    }
    this.setState({
      isGetCaptcha: true
    }, () => {
      var timer = setInterval(() => {
        if(this.state.sec === 0) {
          this.setState({
            isGetCaptcha: false
          })
          return clearInterval(timer)
        }
        this.setState({
          sec: this.state.sec - 1
        })
      }, 1000)
    })
  }

  // 输入原密码
  inputOldPassword= (val) => {
    this.setState({
      oldPassword: val
    })
  }
  // 输入新密码
  inputNewPassword = (val) => {
    this.setState({
      newPassword: val
    })
  }
  // 再次输入新密码
  inputNewPasswordAgain = (val) => {
    this.setState({
      newPasswordAgain: val
    })
  }
  // 确认修改
  submit = () => {
    let oldPassword = this.state.oldPassword
    let newPassword = this.state.newPassword
    let newPasswordAgain = this.state.newPasswordAgain
    
    if(oldPassword === '') {
      return Toast.info('请输入原始密码', 1);
    }
    if(newPassword === '') {
      return Toast.info('请输入新密码', 1);
    }
    if(newPasswordAgain === '') {
      return Toast.info('请确认密码', 1);
    }
    if(newPassword !== newPasswordAgain) {
      return Toast.info('新密码输入不一致', 1);
    }

    // 对密码进行加密

    let key = 'key'
    let encryptOldPwd = CryptoJS.AES.encrypt(oldPassword, key).toString()
    let encryptNewPwd = CryptoJS.AES.encrypt(newPassword, key).toString()

    let data = this.$qs.stringify({
      oldPassword: encryptOldPwd,
      newPassword: encryptNewPwd    
    })


    this.$axios.post('/modifyPassword', data, ({
      headers: {
        key: key
      }
    })).then(res => {
      if(res.data.status === 200) {
        Toast.info('修改成功,请重新登录', 1, () => {
          this.props.removeUserInfo()
          this.props.history.push('/tab/my')
        });
      }
    })
  }

  
}


function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    removeUserInfo () {
      dispatch({
        type: 'REMOVE_USER_INFO',
      })
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Setting)
