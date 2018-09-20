import React from 'react'
import { SearchBar } from 'antd-mobile';
import '../../../css/Home/Search.min.css'
export default class Search extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // 是否显示灰色弹出层
      isPopupsShow: false,
      // 搜索框内容
      searchValue: '',
      // 后选词内容
      candidates: ['1','2','3']
    }
  }




  render() {
    return(
      <div className="home_search">
        <SearchBar
          placeholder="请输入关键字"
          value={this.state.searchValue}
          onChange={this.searchChange}
          onCancel={this.searchCancel}
          onClear={this.searchClear}
          onBlur={this.searchBlur}
          onSubmit={this.searchSubmit}
         />
        {/* <div className="popups" style={{display: this.state.isPopupsShow ? '' :  'none'}}> */}
        <div className="popups" style={{height: this.state.isPopupsShow ? '100%' :  '0px'}}>

          {this.state.candidates.map((item, i) =>{
            return(
              <p key={i} onClick={this.selectCandidates} style={{backgroundColor: 'red'}}>{item}</p>
            )
          })}
        </div>
      </div>
    )
  }

  // 自定义方法

  // 搜索框改变内容
  searchChange = (val) => {
    this.setState({
      // 显示灰色弹出层
      isPopupsShow:true,
      // 改变搜索框内容
      searchValue: val
    })
  }
  // 点击搜索框取消按钮
  searchCancel = () => {
    this.setState({
      // 隐藏灰色弹出层
      isPopupsShow:false,
      // 清除搜索框内容
      searchValue: ''
    })
  }
  // 清除搜索框内容,并隐藏弹出层
  searchClear = (val) => {
    
  }
  // 点击候选词
  selectCandidates = (e) => {
    this.setState({
      searchValue: e.target.innerText,
      isPopupsShow:false,
    })
  }
  // 失去焦点事件
  searchBlur = () => {
    this.setState({
      isPopupsShow:false
    })
  }
  // 提交搜索
  searchSubmit =(val) => {
    console.log(val)
  }
}
