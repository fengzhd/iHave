import React from 'react'
import {Link} from 'react-router-dom'

import { Grid } from 'antd-mobile';
import '../../../css/Home/Gride.min.css'
export default class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [
        {
          img: require('../../../assets/img/basketball.jpg'),
          title: '篮球',
          desc: '纯白系列秒杀'
        },
        {
          img: require('../../../assets/img/running.jpg'),
          title: '跑步',
          desc: '女王节秒杀'
        },
        {
          img: require('../../../assets/img/fitness.jpg'),
          title: '健身',
          desc: '布瑞特装备秒杀'
        },
        {
          img: require('../../../assets/img/football.jpg'),
          title: '足球',
          desc: '其实是在吹总裁'
        },
        {
          img: require('../../../assets/img/tide.jpg'),
          title: '潮流',
          desc: '78元短袖秒杀'
        },
        {
          img: require('../../../assets/img/digital.jpg'),
          title: '数码',
          desc: 'GAMING'
        },
        
        
      ]
    }
  }
  render() {
    return(
      <div className='home_gride'>
        <Grid 
          data={this.state.data}
          columnNum={2}
          onClick={this.toCategoryDetail}
          renderItem={dataItem => (
            <Link tag="span" to={'/CategoryDetail/'+dataItem.title} className="item_box" style={{ padding: '5px' }}>
              <div className="title">
                <h5>{dataItem.title}</h5>
                <p>{dataItem.desc}</p>
              </div>
              <div className="img">
                <img src={dataItem.img} alt="" />
              </div>
            </Link>
          )}
        />
      </div>
    )
      
    
  }
}
