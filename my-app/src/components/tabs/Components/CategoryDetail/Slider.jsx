import React from 'react'
import '../../../../css/Components/CategoryDetail/CategoryDetailSlider.min.css'

export default class Slider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: ['1', '2', '3'],
      imgHeight: 176,
      desireList: [],
      itemWidth: 0
    }
  }
  componentWillMount () {
    this.getDesireList()
  }
  componentDidMount () {
    // setTimeout(() =>{
    //   this.getWidth()
    // },5000)
  }
  render() {
    return(
      <div className="categoryDetail_slider">
        <div className="item_box" style={{width: this.state.itemWidth}}>
          {this.state.desireList.map((item, i) => {
            return(
              <div key={i} className="item" ref="item">
                <img src={item.img} alt="" onLoad={this.getWidth}/>
                <span>{item.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  // 获取欲望清单信息
  getDesireList = () => {
    this.$axios.get('/getDesireList/' + this.props.title).then(res => {
      let data = res.data.result
      this.setState({
        desireList: data
      })
    }) 
  }

  // 获取元素总宽度
  getWidth = () =>{
    let width = this.refs.item.getBoundingClientRect().width
    this.setState({
      itemWidth: this.state.itemWidth + width
    })
  }

}
