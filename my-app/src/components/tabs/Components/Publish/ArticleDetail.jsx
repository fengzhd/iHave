import React from 'react'
import { NavBar, Icon } from 'antd-mobile';
import '../../../../css/Components/Publish/ArticleDetail.min.css'
export default class ArticleDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {}
    }
  }
  componentDidMount () {
    this.getArticleDetail()
  }
  render() {
    console.log(this.props.match.params.id)
    return(
      <div className="ArticleDetail">
        <div className="tabbar">
          <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={() => this.props.history.go("-1")}
            >
              详情
            </NavBar>
        </div>
        <div className="main">
          <h2 className="title">{this.state.data.title}</h2>
          <p className="time">发表时间: {this.state.data.ctime}</p>
          <div className="content">
            <div dangerouslySetInnerHTML = {{ __html:this.state.data.content }}></div>
          </div>
        </div>
      </div>
    ) 
      
    
  }

  getArticleDetail = () => {
    this.$axios.get('/getArticleDetail/'+this.props.match.params.id).then(res => {
      this.setState({
        data: res.data.result
      })
    })
  }
}
