import React from 'react'
import { NavBar, Icon, Badge, Toast } from 'antd-mobile';
import {  connect } from 'react-redux'

import Silder from './Silder.jsx'
import Select from './Select.jsx'

import '../../../../css/Components/GoodsDetail/GoodsDetail.min.css'
class GoodsDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      data: {},
      isOpenSelect: false,
      openWay: '选择商品',
      colorVal: '',
      sizeVal: ''
    }
  }
  componentWillMount () {
    this.getGoodsDetail()
  }
  render () {
    return(
      <div className="goodsdetail">
        {/* 导航栏 */}
        <div className="navBar" style={{zIndex: 99}}>
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.go(-1)}
            rightContent={[
              <Icon key="1" type="ellipsis" />,
            ]}
          >
            详细信息
          </NavBar>
        </div>
        {/* 轮播图展示 */}
        <div>
          {(() => {
            if(this.state.data.imgs) {
              return <Silder imgs={this.state.data.imgs}></Silder>
            }
          })()}
        </div>
        {/* 商品价格内容 */}
        <div className="cont">
          <h4>{this.state.data.name}</h4>
          <div className="price">
            <span>¥{this.state.data.price}</span>
            {(() => {
              if(this.state.data.tags) {
                let arr = []
                this.state.data.tags.forEach((item, i) => {
                  arr.push(<Badge key={i} text={item} style={{ marginLeft: 12, padding: '0 3px', backgroundColor: '#f00', borderRadius: 2 }} />)
                })
                return arr
              }
            })()}
          </div>
          <div className="other">
            <div>快递 : {this.state.data.freight}</div>
            <div>点击量 : {this.state.data.hits}</div>
          </div>
        </div>
        {/* 选择商品样式 */}
        <div className="selectBox">
            <div className="select">
              <div onClick={this.openSelect}>
                选择商品
                <i className="iconfont">&#xe619;</i>
                <span>{this.state.sizeVal}</span>
                <span>{this.state.colorVal}</span>
              </div>
              <div onClick={this.openSelect}>
                商品详情
                <i className="iconfont">&#xe619;</i>
              </div>
            </div>
            <div>
              <Select isOpenSelect={this.state.isOpenSelect} info={this.state.data} openWay={this.state.openWay} getSelectVal={this.getSelectVal}></Select>
            </div>
        </div>
        {/* 商品评价 */}
        <div className="comment">
            <h4>用户评价</h4>
            <div className="comment_list">
              <div className="comment_item">
                <div className="top">
                  <div className="header">
                    <img src="http://shihuo.hupucdn.com//wx_user/avatar/1524342263/c672f1a5f3780b352f19625e9615fcf1" alt=""/>
                  </div>
                  <div className="nikename">
                    <h3>Mr滚</h3>
                    <span>1小时前</span>
                  </div>
                  <div className="like">
                    <i className="iconfont">&#xe64a;</i>
                    <span>1</span>
                  </div>
                </div>
                <div className="content">
                  对于运动中防臭去汗，我觉得装备是关键，毛巾袜防臭脚，护腿护臂保护同时可以吸汗排汗，包括紧身衣排汗效果很好，止汗露可以用用，但个人觉得效果不大，另外强推冷感毛巾，你运动得喝水吧，稍微倒点水在毛巾上，甩两下凉嗖嗖啊。运动后防臭就是及时洗衣服，犹记忘在后备箱一周的球服，那酸爽……阿嚏……（这么走心点个赞啊兄dei）
                </div>
              </div>
            </div>
        </div>
        {/* 加入购物车 */}
        <div className="addToCar">
          <div>
            <i className="iconfont">&#xe736;</i>
            店铺
          </div>
          <div>
            <i className="iconfont">&#xe62d;</i>
            收藏
          </div>
          <div>
            <i className="iconfont">&#xe624;</i>
            客服
          </div>
          <div>
            <i className="iconfont">&#xe6f0;</i>
            分享
          </div>
          <div onClick={this.addToCar}>
            <i className="iconfont">&#xe602;</i>
            加入购物车
          </div>
        </div>
      </div>
    )
  }

  // 获取商品参数
  getGoodsDetail = () => {
    this.$axios.get('/getGoodsDetail/' + this.state.id).then(res => {
      let data = res.data.result[0]
      data.imgs = data.imgs
      data.color = data.color.split(',')
      data.size = data.size.split(',')
      if (data.tags) {
        data.tags = data.tags.split(',')
      }
      this.setState({
        data: data
      })
    })
  }
  // 打开下拉菜单
  openSelect = (e) =>{
    console.log(e.target.innerText)
    this.setState({
      isOpenSelect: true,
      openWay: e.target.innerText.substr(0, 4)
    })
  }
  // 获取选择后的颜色和尺码
  getSelectVal = (colorVal, sizeVal) => {
    this.setState({
      colorVal: colorVal,
      sizeVal: sizeVal,
      isOpenSelect: false
    })
  }

  // 加入购物车
  addToCar = () => {
    if(!this.props.user.isLogin) {
      return Toast.fail('请先登录', 1);
    }
    let color = this.state.colorVal
    let size= this.state.sizeVal
    let count = 1
    let isSelect = 0
    if(color === '') {
      return Toast.fail('请选择颜色', 1);
    }
    if(size === '') {
      return Toast.fail('请选择尺码', 1);
    }
    let data = {
      ...this.state.data,
      color : color,
      size: size,
      count:count,
      isSelect: isSelect
    }

    this.$axios.post('/addToCar', data).then(res => {
      if(res.data.status === 200) {
        return Toast.success('添加成功', 1);
      }
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



export default connect(mapStateToProps, mapDispatchToProps)(GoodsDetail)
