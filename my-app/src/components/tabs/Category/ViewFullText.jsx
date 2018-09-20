import React from 'react'
import '../../../css/Category/ViewFullText.min.css'
import { NavBar, Icon   } from 'antd-mobile';

export default class ViewFullText extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {}
    
    }
  }
  componentDidMount () {
    this.getFullText()
  }
  render() {
    return(
      <div className="viewFullText">
        <div className="navbar">
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.go("-1")}
          >
            查看全文
          </NavBar>
        </div>
        <div className="item">
          <div className="top">
            <div className="img">
              <div>
                <img src={this.state.data.headerImg} alt=""/>
              </div>
            </div>
            <div className="title">
              <div className="name">
                <h5>
                  {this.state.data.username}
                </h5>
                <p>{this.state.data.ctime}</p>
              </div>
              <h5 className="attention">关注</h5>
            </div>
          </div>
          <div className="text">
            <h2>{this.state.data.title}</h2>
            <div dangerouslySetInnerHTML = {{ __html: this.state.data.content }}></div>
          </div>
        </div>
      </div>
    ) 
  }
  getFullText = () => {
    this.$axios.get('/getFullText/'+this.props.match.params.id).then(res => {
      console.log(res)
      this.setState({
        data: res.data.result[0]
      })
    })
  }
}
