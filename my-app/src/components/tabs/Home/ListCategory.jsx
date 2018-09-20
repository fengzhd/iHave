import React from 'react'
import { Tabs } from 'antd-mobile';
import List from './List.jsx'
import '../../../css/Home/ListCategory.min.css'





export default class ListCategory extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tabs: [
        { title: '推荐' },
        { title: '篮球' },
        { title: '跑步' },
        { title: '健身' },
        { title: '潮流' },
      ],
      nowList: '推荐',
    }
  }
  tabsBox = null
  tabbarTop = 0
  
  render() {
    return(
      <div className="home_ListCategory" ref="tabsBox">
        <Tabs tabs={this.state.tabs}
          initialPage={0}
          onTabClick={this.tabClick}
          onChange={this.tabChange}
          prerenderingSiblingsNumber={0}
        >
          <List nowList={this.state.nowList}></List>
        </Tabs>
      </div>
    ) 
  }
  componentDidMount () {
    console.log(this)
    setTimeout(() => {
      this.getTabsDistanceFromTop()
    },3000)
    // this.getTabsDistanceFromTop()
    window.onload =  () => {
      this.getTabsDistanceFromTop()
    }
  }
  // 分类列表距顶部的距离
  getTabsDistanceFromTop () {
    if(!this.refs.tabsBox) {
      return
    }
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const tabBar = this.refs.tabsBox.firstChild.firstChild
    let top = 0
    if(scrollTop === 0) {
      top = tabBar.getBoundingClientRect().top
    } else {
      top = tabBar.getBoundingClientRect().top + scrollTop
    }
    this.tabbarTop = top
    console.log('tabbarTop'+this.tabbarTop)    
    const scrollHandler =  (e) => {
      let scrollTop2 = document.documentElement.scrollTop || document.body.scrollTop
      this.tabsBox = e.target
      let ST = scrollTop2
      if (ST >= top) {
        tabBar.classList.add('fixed')
      } else {
        tabBar.classList.remove('fixed')
      }
    }
   window.addEventListener('scroll', scrollHandler, true); 
  }
  // 切换分类
  tabChange = (tab,index) => {
    if(!this.tabsBox) {
      return
    }
    // this.tabsBox.scrollTo(0,this.tabbarTop);
  }
  // 点击分类
  tabClick = (tab, index) => { 
    this.setState({
      nowList: tab.title
    })
  }
  

  
    
}



