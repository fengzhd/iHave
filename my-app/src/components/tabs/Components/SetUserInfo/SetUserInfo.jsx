import React from 'react'
import { NavBar, Icon, Modal } from 'antd-mobile';
import {  connect } from 'react-redux'
import {Link} from 'react-router-dom'

import '../../../../css/Components/SetUserInfo/SetUserInfo.min.css'

const alert = Modal.alert;

const prompt = Modal.prompt;

class SetUserInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isTelTrue: true
    }
  }
  
  render() {
    return(
      <div className="setUserInfo">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.go("-1")}
        >
          修改信息
        </NavBar>
        <div className="infos">
          <div ref="selectHeader" className="selectHeader" onClick={this.modifyHeader}>
            头像
            <div className="header">
              <img src={this.props.user.info.headerImg} alt=""/>
            </div>
            <input className="addImageInput" onChange={this.selectImg} type="file"accept="image/gif, image/jpeg, image/png"/>
          </div>
          <div>
            用户名
            <i className="iconfont">&#xe619;</i>
            <span>{this.props.user.info.username}</span>
          </div>
          <div onClick={() =>
                alert('选择性别', <div></div>, [
                  { text: '男', onPress: this.selectGender.bind(this, 1) },
                  { text: '女', onPress: this.selectGender.bind(this, 0) },
                  { text: '取消', onPress: this.selectGender.bind(this, 100) },
                ])
              }>
            性别
            <i className="iconfont">&#xe619;</i>
            {(() => {
              if(this.props.user.info.gender === 1) {
                return <span>男</span>
              } else if(this.props.user.info.gender === 0) {
                return <span>女</span>
              }
            })()}
            
          </div>
          <div onClick={() => prompt('请输入年龄', '', [
                  { text: '取消' },
                  { text: '提交', onPress: this.selectAge },
                ], 'default', this.props.user.info.age)}
          >
            年龄
            <i className="iconfont">&#xe619;</i>
            <span>{this.props.user.info.age}</span>
          </div>
          <Link to={'/setting/手机号码'}>
            手机号码
            <i className="iconfont">&#xe619;</i>
            <span>{this.props.user.info.tel}</span>
          </Link>
          <Link to={'/setting/密码'}>
            修改密码
            <i className="iconfont">&#xe619;</i>
          </Link>
        </div>

      </div>
    ) 
  }

  // 修改头像
  selectImg =(e) => {
    let file = e.target.files[0]
    console.dir(file)
    let formData = new FormData()
    formData.append('file',file);
    this.$axios.post('/uploadingHeader', formData, ({
      headers : {'Content-Type':'multipart/form-data'} 
    })).then(res => {
      this.props.setUserInfo(res.data.result)
    })
  }
  // 修改性别
  selectGender = (gender) => {
    if(gender === 100) {
      return
    }
    this.$axios.get('/uploadingGender/' +gender ).then(res => {
      this.props.setUserInfo(res.data.result)
    })
  }

  // 修改年龄
  selectAge = (age) => {
    if(age === '') {
      return
    }
    this.$axios.get('/uploadingAge/' +age ).then(res => {
      this.props.setUserInfo(res.data.result)
    })
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



export default connect(mapStateToProps, mapDispatchToProps)(SetUserInfo)
