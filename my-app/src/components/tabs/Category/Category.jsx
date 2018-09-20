import React from 'react'
import { NavBar   } from 'antd-mobile';
import List from './List.jsx'
import '../../../css/Category/Category.min.css'
export default class Category extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    
    }
  }
  render() {
    return(
      <div className="community">
        <div className="navbar">
          <NavBar
            mode="light"
          >
            社区
          </NavBar>
        </div>
        <div>
          <List></List>
        </div>

      </div>
    )
      
    
  }
}
