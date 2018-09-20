import React from 'react'
import { Carousel } from 'antd-mobile';
export default class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      imgHeight: 176,
    }
  }
  componentDidMount() {
    this.getAdvertising()
  }
  render() {
    return(
        <Carousel
          autoplay={false}
          infinite
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map((item, i) => (
            <img
              key={i}
              src={item.imgPath}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                window.dispatchEvent(new Event('resize'));
                this.setState({ imgHeight: 'auto' });
              }}
            />
          ))}
        </Carousel>
    ) 
  }
  getAdvertising = () => {
    this.$axios.get('/getAdvertising').then((res) => {
      let data = res.data.result
      this.setState({
        data: data
      })
    })
  }

  
}
