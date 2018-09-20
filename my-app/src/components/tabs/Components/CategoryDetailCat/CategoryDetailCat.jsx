import React from 'react'
import TabBar from './TabBar.jsx'
import OrderBy from './OrderBy.jsx'
import List from './List.jsx'
export default class CategoryDetailCat extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: this.props.match.params.title,
      nowListFirstTitle: '人气最高',
      nowListSecondTitle: '全部价格',
      showListWay: true
    }
  }
  render() {
    return(
      <div className="categoryDetailCat" style={{paddingTop: 84}}>
        <div  style={{position: "fixed", top: 0, left: 0, width: '100%', height: '100%', zIndex: 99}}>
          {/* 搜索框 */}
          <div className='search'>
            <TabBar getShowListWay={this.getShowListWay} history={this.props.history}></TabBar>
          </div>
          {/* 排序栏 */}
          <div className="orderBy">
            <OrderBy getOrderByTitle={this.getOrderByTitle}></OrderBy>
          </div>
        </div>
        {/* 列表 */}
        <div>
          <List title={this.state.title} nowListFirstTitle={this.state.nowListFirstTitle} nowListSecondTitle={this.state.nowListSecondTitle} showListWay={this.state.showListWay}></List>
        </div>
      </div>
    ) 
  }
  // 获取当前排序方式
  getOrderByTitle = (firstTitle, secondTitle) => {
    this.setState({
      nowListFirstTitle: firstTitle,
      nowListSecondTitle: secondTitle,
    })
  }
  // 获取数据排列方式
  getShowListWay = (showListWay) => {
    this.setState({
      showListWay: showListWay
    })
  }

}
