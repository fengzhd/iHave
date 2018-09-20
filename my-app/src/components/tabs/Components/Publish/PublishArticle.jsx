import React from 'react'
import { NavBar, Icon } from 'antd-mobile';
import Editor from './Editor.jsx'
export default class PublishArticle extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      
    }
  }
  render() {
    console.log(this)
    return(
      <div style={{paddingTop: 45, background: '#fff'}}>
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%'}}>
          <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={() => this.props.history.go("-1")}
            >
              发表文章
            </NavBar>
        </div>
        <div>
          <div style={{background: '#fff'}}>
            <Editor history={this.props.history}></Editor>
          </div>
        </div>
      </div>
    ) 
  }
}
