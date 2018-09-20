import React from 'react'
import { NavBar, Icon } from 'antd-mobile';
import {Link} from 'react-router-dom'
export default class Publish extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: []
    }
  }
  componentDidMount () {
    this.getMyArticles()
  }
  render() {
    return(
      <div>
        <div>
          <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={() => this.props.history.go("-1")}
              rightContent={[
                <span key={0} onClick={this.toPublish}>发表</span>
              ]}
            >
              我的发表
            </NavBar>
        </div>
        <div>
          {this.state.list.map((item, i) => {
            return(
              <Link to={'/toArticleDetail/'+item.id} key={i} onClick={this.toArticleDetail} style={{display: 'flex', lineHeight: 3, padding: '0 10px', margin: '5px 0', background: '#fff'}}>
                <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                  <h3 style={{margin: 0}}>{item.title}</h3>
                </div>
                <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                  {item.ctime}
                </div>
                <div>
                  <i className="iconfont">&#xe619;</i>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    ) 
  }
  toPublish = () => {
    this.props.history.push('/publishArticle')
  }

  getMyArticles = () => {
    this.$axios.get('/getMyArticles').then(res => {
      this.setState({
        list: res.data.result
      })
    })
  }

}
