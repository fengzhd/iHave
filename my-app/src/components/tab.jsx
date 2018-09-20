import React from 'react'
import Home from './tabs/Home/Home.jsx'
import Category from './tabs/Category/Category.jsx'
import ShoppingCar from './tabs/ShoppingCar/ShoppingCar.jsx'
import My from './tabs/My/My.jsx'
import '../css/Tab/tab.min.css'
import { Route, Link, Redirect} from 'react-router-dom'
import {  connect } from 'react-redux'

class Tab extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: this.props.location.pathname,
      data: [
        {
          title: '首页',
          path: '/tab/home',
          icon: '\ue626'
        },
        {
          title: '社区',
          path: '/tab/category',
          icon: '\ue7f9'
        },
        {
          title: '购物车',
          path: '/tab/shoppingCar',
          icon: '\ue606'
        },
        {
          title: '我的',
          path: '/tab/my',
          icon: '\ue66c'
        }
      ]
    }
  }
  render() {
    return(
      <div className="tabBar">
        <div>
          <Route exact  path='/tab/home' component={Home}></Route>
          <Route exact  path='/tab/category' component={Category}></Route>
          {/* <Route exact  path='/tab/shoppingCar' component={ShoppingCar}></Route> */}

          <Route exact  path='/tab/shoppingCar' render={(props) => {return (this.props.user.isLogin ? <ShoppingCar {...props} /> : <Redirect to='/login'/>)}}></Route>


          <Route exact  path='/tab/my' component={My}></Route>
        </div>
        <div className="tabBar_box" style={{zIndex: 99}}>
        {this.state.data.map((item, i) => {
          return(
            <Link replace to={item.path} className={this.state.active === item.path ? "active" : ''} key={i} onClick={this.selectTab.bind(this, item.path)}>
              <i className="iconfont" style={{fontSize: 20}}>{item.icon}</i>
              {item.title}
            </Link>
          )
        })}
        </div>
      </div>

    ) 
      
    
  }

  selectTab =(title) => {
    this.setState({
      active: title
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
export default connect(mapStateToProps, mapDispatchToProps)(Tab)
