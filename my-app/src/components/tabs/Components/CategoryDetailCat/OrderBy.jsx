import React from 'react'
import '../../../../css/Components/CategoryDetailCat/OrderBy.min.css'
export default class OrderBy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [
        {
          title: '特价优惠',
          child: ['低价运动装备限时抢购,每日更新', '选择包邮商家可免费享受包邮服务'],
          isShow: false
        },
        {
          title: '人气最高',
          child: ['人气最高','新品上架','价格由高到底','价格由低到高',],
          isShow: false
        },
        {
          title: '全部价格',
          child: ['全部价格','0-100','100-300','300-500','500-1000','1000-10000',],
          isShow: false
        }
      ],
      isShow: false
    }
  }
  
  render() {

    return(
      <div className="orderby_box">
        {this.state.data.map((item, i) => {
          return(
            <div className="orderby_item" key={i} onClick={this.show.bind(this, item, i)}>
              <div>
                {item.title}
                {(() => {
                  if(item.isShow){
                    return <i className="iconfont">&#xe7fc;</i>
                  }else {
                    return <i className="iconfont">&#xe7fa;</i>
                  }
                })()}
              </div>
              <div className="content_box" style={{height: item.isShow ? '100%' : '0px'}}>
                {item.child.map((childItem, index) => {
                  return(
                    <div key={index} onClick={this.selectOrderByTitle.bind(this, childItem, i)} className="content_item">{childItem}</div>
                  )
                })}
              </div>
            </div>
          )
        })}
        
      </div>
    )
      
    
  }

  show = (item, index) => {
    let arr = this.state.data
    arr.forEach((item, i) => {
      if (i === index) {
        item.isShow = !item.isShow
      } else {
        item.isShow = false
      }
      
    })
    this.setState({
      data: arr
    })
  }

  selectOrderByTitle = (childItem, index) => {
    if (index === 0) {
      return
    }
    let arr = this.state.data
    arr.forEach((item, i) => {
      if(index === i) {
        item.title = childItem
      }
    })
    this.setState({
      data: arr
    }, () => {
      var firstTitle = ''
      var secondTitle = ''
      this.state.data.forEach((item, i) => {
        if(i === 1) {
          firstTitle = item.title
        }
        if(i === 2) {
          secondTitle = item.title
        }
      })
      this.props.getOrderByTitle(firstTitle, secondTitle)
    })
  }
}
