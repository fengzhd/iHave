import React from 'react'
import { NavBar, Icon, Carousel, WingBlank  } from 'antd-mobile';
import '../../../../css/Components/CategoryDetail/CategoryDetail.css'
import Slider from './Slider.jsx'
import ListCategory from './ListCategory.jsx'
import List from './List.jsx'
import { Link } from 'react-router-dom';
export default class CategoryDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // 父分类标题
      title: '',
      // 分类信息
      categoryInfo: [],
      // 热门活动信息
      hotActivitie: [],
      // 欲望清单列表
      desireList: [],
      // 列表分类是否浮动定位
      isListCategoryFixed: false,
      // 当前列表 全部
      nowList: 'all',
      // 热词
      hotTest: {
        first: [
          {
            title: '---'
          },
          {
            title: '---'
          }
        ],
        second: [
          {
            title: '---'
          },
          {
            title: '---'
          }
        ],
      }
    }
  }
  componentWillMount () {
      this.getCategoryDetailInfo()
  }
  componentDidMount () {
    // 绑定滚动事件
    let addEvent = () => {
      window.addEventListener('scroll', (e) => {
        // 获取滚动条位置
        let ST = document.documentElement.scrollTop || document.body.scrollTop
        // 如果 滚动条位置 大于 分类栏距顶部的距离减去导航栏的高度 则浮动定位
        if (ST >= top - 45) {

          this.setState({
            isListCategoryFixed: true
          })
        }else {
          this.setState({
            isListCategoryFixed: false
          })
        }
      }, true)
    }
    let top = 0
    // 获取分类栏距顶部的距离
    setTimeout(() => {
      if (!this.refs.listCategory) {
        return
      }
      top = this.refs.listCategory.getBoundingClientRect().top
      let ST = document.documentElement.scrollTop
      if (ST >= top - 45) {
        this.setState({
          isListCategoryFixed: true
        })
      }else {
        this.setState({
          isListCategoryFixed: false
        })
      }
      addEvent()
    }, 1000)
    
  }
  
  render() {
    return(
      <div className="CategoryDetail">
        {/* 顶部导航栏 */}
        <div className="nav_bar">
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.go("-1")}
            rightContent={[
              <Icon key="1" type="ellipsis" />,
            ]}
          >
            {this.state.title}专区
          </NavBar>
        </div>
        {/* 分类栏 */}
        <div className="category" style={{justifyContent: this.state.categoryInfo.length > 5 ? '' : 'center'}}>
          {this.state.categoryInfo.map(((item, i) => {
            return(
              <Link to={'/CategoryDetailCat/'+item.categoryName}  key={i} className="category_item" style={{flex: this.state.categoryInfo.length >= 5 ? '' : 1,width: this.state.categoryInfo.length >= 5 ? '19%' : ''}}>
                <img src={item.icon} alt=""/>
                <p>{item.categoryName}</p>
              </Link>
            )
          }))}
        </div>
        {/* 竖向广告轮播 */}
        <div className="verticalCarousel">
          <div className="icon">
            <img src={require('../../../../assets/icon/hottest_32eac13.jpg')} alt=""/>
          </div>
          <div className="content">
            <WingBlank>
              <Carousel className="my-carousel"
                vertical
                dots={false}
                dragging={false}
                swiping={false}
                autoplay
                infinite
              >
                {this.state.hotTest.first.map((obj, i) =>{
                  return(
                    <div className="v-item" key={i}>{obj.title}</div>
                  )
                })}
              </Carousel>
              <Carousel className="my-carousel"
                vertical
                dots={false}
                dragging={false}
                swiping={false}
                autoplay
                infinite
              >
                {this.state.hotTest.second.map((obj, i) =>{
                  return(
                    <div className="v-item" key={i}>{obj.title}</div>
                  )
                })}
              </Carousel>
            </WingBlank>
          </div>
        </div>
        {/* 热门活动栏 */}
        <div className="activitie">
          <h5>热门活动</h5>
          <div className="content">
          {this.state.hotActivitie.map((item, i) => {
            return(
              <div key={i} className="activitie_item">
                <div className="img">
                  <img src={item.img} alt=""/>
                </div>
                <p><b>{item.name}</b></p>
                <p>{item.desc}</p>
              </div>
            )
          })}
          </div>
        </div>
        {/* 横向滚动条 欲望清单 */}
        <div className="slider">
          <h5>欲望清单</h5>
          <Slider title={this.state.title}></Slider>
        </div>
        {/* 列表 */}
        <div className="categoryDetail_list">
          <div className={this.state.isListCategoryFixed ? 'fixed' : ''} ref="listCategory">
            <ListCategory getNowList={this.getNowList}></ListCategory>
          </div>
          <div style={{paddingTop: this.state.isListCategoryFixed ? '38px' : '0px' }}>
            <List title={this.state.title} nowList={this.state.nowList}></List>
          </div>
        </div>
      </div>
    ) 
  }
  
  // 获取传递过来的分类名称,并获取数据
  getCategoryDetailInfo = () => {
    this.setState({
      title: this.props.match.params.title
    }, () => {
      this.getCategoryDetail()
      this.getHotActivitie()
      this.getHotTest()
    })
  }
  // 获取分类信息
  getCategoryDetail = () => {
    this.$axios.get('/getCategoryDetail/' + this.state.title).then(res => {
      let data = res.data.result
      this.setState({
        categoryInfo: data
      })
    })
  }
  // 获取热门活动信息
  getHotActivitie = () => {
    this.$axios.get('/getHotActivitie/' + this.state.title).then(res => {
      let data = res.data.result
      this.setState({
        hotActivitie: data
      })
    })
  }
  // 传递的方法,获取当前列表信息分类
  getNowList = (nowList) => {
    this.setState({
      nowList: nowList
    })
  }
  // 获取hottest文字信息
  getHotTest = () => {
    this.$axios.get('/getHotTest/'+ this.state.title).then(res => {
      let data = res.data.result
      let obj = {
        first: [],
        second: []
      }
      data.forEach((item, i ) => {
        if(i % 2 === 0) {
          obj.first = obj.first.concat(item)
        } else {
          obj.second = obj.second.concat(item)
        }
      })
      this.setState({
        hotTest: obj
      })
    })
  }
  
}

