import React from 'react'
import '../../../../css/Components/CategoryDetail/ListCategory.min.css'
export default class ListCategory extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [
        {
          title: '全部',
          id: 'all'
        },
        {
          title: '单品推荐',
          id: 'single'
        },
        {
          title: '用户晒物',
          id: 'usercomment'
        },
      ],
      nowList: 'all'
    }
  }
  render() {
    return(
      <div className="list_category">
        {this.state.data.map((item, i) => {
          return(
            <div className={this.state.nowList === item.id ? 'active' : ''} key={i} onClick={this.handleClick.bind(this,item, i)}>{item.title}</div>
          )
        })}
      </div>
    ) 
  }
  handleClick =(item, i) => {
    this.setState({
      nowList: item.id
    }, () =>{
      this.props.getNowList(this.state.nowList)
    })
  }
}
