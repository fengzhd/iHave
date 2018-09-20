import React from 'react'
import { Carousel } from 'antd-mobile';
// import '../../../../css/Components/GoodsDetail/Silder.min.css'

export default class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: this.props.imgs,
      imgHeight: 176,
    }
  }

  render() {
    return(
      <div className="silder" style={{backgroundColor: '#fff', textAlign: 'center'}}>
        <Carousel
          autoplay={false}
          infinite
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map((val, i) => (
               <a
               key={val}
               href="http://www.alipay.com"
               style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
             >
               <img
                 src={val}
                 alt=""
                 style={{ width: 'auto', verticalAlign: 'top', height: '200px' }}
                 onLoad={() => {
                   // fire window resize event to change height
                   window.dispatchEvent(new Event('resize'));
                   this.setState({ imgHeight: 'auto' });
                 }}
               />
             </a>
          ))}
        </Carousel>
      </div>
    )
      
    
  }
}
