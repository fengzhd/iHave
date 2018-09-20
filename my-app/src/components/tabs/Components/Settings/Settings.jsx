import React from 'react'
import { NavBar, Icon, Button } from 'antd-mobile';
import {  connect } from 'react-redux'

 class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    
    }
  }
  render() {
    return(
      <div className="setting">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.go("-1")}
        >设置</NavBar>
        {
          (() => {
            if(this.props.user && this.props.user.isLogin) {
              return(
                <div style={{padding: '0px 20px'}}>
                  <Button onClick={this.logout} type="warning">注销登录</Button>
                </div>
              )
            }
          })()
        }
      </div>
    )
      
    
  }

  logout = () => {
    this.$axios.get('/logout').then(res => {
      if(res.data.status === 200) {
        this.props.removeUserInfo()
        this.props.history.push('/tab/my')
      }
    })
  }
}


function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    removeUserInfo () {
      dispatch({
        type: 'REMOVE_USER_INFO',
      })
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Settings)