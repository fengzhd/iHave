import React from 'react'
// import '../../../css/componentCss/home.min.css'
import Slider from './Slider.jsx'
import Search from './Search.jsx'
import Grid from './Grid.jsx'
import ListCategory from './ListCategory.jsx'

export default class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    
    }
  }
  render() {
    return(
      <div className="home">
        <div className="search">
          <Search></Search>
        </div>
        <div className='swipe'>
          <Slider></Slider>
        </div>
        <div className="grid">
          <Grid></Grid>
        </div>
        <div className="listCategory">
          <ListCategory getRef={this.getRef}></ListCategory>
        </div>
      </div>
    )
  }

}
