import React from 'react'
import { NavBar, Icon } from 'antd-mobile';
import '../../../../css/Components/CategoryDetailCat/TabBar.min.css'
export default class TabBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showListWay: true
    }
  }
  
  render() {
    return(
      <div className="category_detail_cat_tab_bar">
        <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={() => this.props.history.go(-1)}
              rightContent={[
                this.state.showListWay ? <i className="iconfont" key="0" onClick={this.selectShowListWay} style={{ marginRight: '16px', fontSize: 20 }}>&#xe600;</i> : <i className="iconfont" key="0" onClick={this.selectShowListWay} style={{ marginRight: '16px', fontSize: 20 }}>&#xe62e;</i>,
                <Icon key="1" type="ellipsis" />,
              ]}
            >
              <Icon key="0" type="search" />
              <input type="text" placeholder="请输入关键词"/>
            </NavBar>
          </div>
      </div>
    )
  }
  selectShowListWay = () => {
    this.setState({
      showListWay: !this.state.showListWay
    }, () => {
      this.props.getShowListWay(this.state.showListWay)
    })
  }
}
