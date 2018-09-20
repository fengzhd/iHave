import React from 'react'
import {  connect } from 'react-redux'
import { Link } from 'react-router-dom';
import '../../../css/My/My.min.css'
 class My extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      
    }
  }

  componentDidMount () {
    this.getUserInfo()
  }
  render() {
    return(
      <div className="my">
        <div className="user">
          <div className="left" onClick={this.toSetUerInfo}>
            <div className="header">
              <img src={this.props.user.info.headerImg} alt=""/>
            </div>
            <div className="login">
              <div className="name">
                {(() => {
                  if(!this.props.user.isLogin) {
                    return(
                      <div>
                        <Link to="/login">登录</Link>
                        &nbsp;&nbsp;&nbsp;
                        <Link to="/register">注册</Link>
                      </div>
                    )
                  } else {
                    return(
                      <div>
                        <span>{this.props.user.info.username}</span>
                        &nbsp;
                        {
                          (() => {
                            if(this.props.user.info.gender === 1) {
                              return <i className="iconfont">&#xe6e7;</i>
                            } else {
                              return <i className="iconfont">&#xe6e8;</i>
                            }
                          })()
                        }
                      </div>
                    )
                  }
                })()}
              </div>
              <span>金币&nbsp;{this.props.user.info.gold}</span>
            </div>
          </div>
          <div className="right">
            <div className="setting">
              <span><i className="iconfont">&#xe616;</i></span>
              &nbsp;&nbsp;&nbsp;
              <span><i className="iconfont">&#xe66a;</i></span>
            </div>
            <div className="sign">
              <span>签到送金币</span>
            </div>
          </div>
        </div>
        <div className="option">
          <div>
            <i className="iconfont">&#xe7ae;</i>
            我的收藏
            <i className="iconfont">&#xe619;</i>
          </div>
          <div>
            <i className="iconfont">&#xe679;</i>
            我的评论
            <i className="iconfont">&#xe619;</i>
          </div>
          <Link to='/publish'>
            <i className="iconfont">&#xe615;</i>
            我的发表
            <i className="iconfont">&#xe619;</i>
          </Link>
          <div>
            <i className="iconfont">&#xe64e;</i>
            收获地址管理
            <i className="iconfont">&#xe619;</i>
          </div>
          <div>
            <i className="iconfont">&#xe62a;</i>
            联系客服
            <i className="iconfont">&#xe619;</i>
          </div>
          <div>
            <i className="iconfont">&#xe613;</i>
            意见反馈
            <i className="iconfont">&#xe619;</i>
          </div>
          <Link to="/settings">
            <i className="iconfont">&#xe616;</i>
            设置
            <i className="iconfont">&#xe619;</i>
          </Link>
        </div>
      </div>
    )
  }

  // 获取用户信息
  getUserInfo = () => {
    if(!this.props.user.isLogin) {
      this.$axios.get('/getUserInfo').then(res => {
        if (res.data.user && res.data.user.isLogin) {
          // 调用redux存储用户信息
          this.props.setUserInfo(res.data.user)
        }
      })
    }
    
  }
  // 跳转到修改个人信息页面
  toSetUerInfo = () => {
    if(this.props.user.isLogin) {
      this.props.history.push('/setUserInfo')
    }
  }
}




function mapStateToProps(state) {
  return state
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



export default connect(mapStateToProps, mapDispatchToProps)(My)



