import React from 'react'
import '../../../../css/Components/GoodsDetail/Select.min.css'
export default class Select extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpenSelect: false,
      info: this.props.info,
      colorVal: '',
      sizeVal: ''
    }
  }
  componentWillReceiveProps (val) {
    if(this.props.isOpenSelect.isOpenSelect !== val.isOpenSelect) {
      this.setState({
        isOpenSelect: val.isOpenSelect
      })
    }
  }
  render() {
    return(
      <div className="select_connect" style={{height: this.state.isOpenSelect ? '' : 0, overflow: 'hidden'}}>
        <div className="main">
          <div className="header">
            <img src={this.props.info.img} alt=""/>
          </div>
          {
            (() => {
              if (this.props.openWay === '选择商品') {
                return(
                  <div>
                    <div className="seColor">
                      <div className="coTitle">选择颜色: </div>
                      <div ref="colors">
                      {
                        (() => {
                          if(this.props.info.color) {
                            let arr = []
                            this.props.info.color.map((item, i) => {
                              return arr.push(<span key={i} onClick={this.clickColors}>{item}</span>)
                            })
                            return arr
                          }
                        })()
                      }
                      </div> 
                    </div>
                    <div className="seSize">
                      <div className="siTitle">选择尺码: </div>
                      <div ref="sizes">
                        {
                          (() => {
                            if(this.props.info.size) {
                              let arr = []
                              this.props.info.size.map((item, i) => {
                                return arr.push(<span key={i} onClick={this.clickSizes}>{item}</span>)
                              })
                              return arr
                            }
                          })()
                        }
                        {/* <span onClick={this.clickSizes}>40</span>
                        <span onClick={this.clickSizes}>41</span>
                        <span onClick={this.clickSizes}>42</span>
                        <span onClick={this.clickSizes}>43</span> */}
                      </div>
                    </div>
                  </div>
                )
              } else {
                if(JSON.stringify(this.props.info) !== '{}') {
                  return(
                    <div className="detailInfo">
                      <div><span>商品名字</span> : {this.props.info.name}</div>
                      <div><span>商品来源</span> : {this.props.info.merchant}</div>
                      <div><span>商品价格</span> : {this.props.info.price}</div>
                      <div><span>商品描述</span> : {this.props.info.intro}</div>
                      <div><span>商品尺寸</span> : {this.props.info.size.join(',')}</div>
                      <div><span>商品颜色</span> : {this.props.info.color.join(',')}</div>
                      <div><span>商品店铺</span> : {this.props.info.store}</div>
                      <div><span>商品标签</span> : {this.props.info.tags.join(',')}</div>
                      <div><span>商品热度</span> : {this.props.info.hits}</div>
                      <div><span>上市时间</span> : {this.props.info.time}</div>
                    </div>
                  )
                }
              }
            })()
          }
          <div className="btn">
            <div onClick={this.cancel}>
              取消
            </div>
            <div onClick={this.ok}>
              确定
            </div>
          </div>
        </div>
        
      </div>
    )
      
    
  }
  // 点击取消关闭下拉框
  cancel = () => {
    this.setState({
      isOpenSelect: false,
      colorVal: '',
      sizeVal: ''
    })
  }
  // 点击确定关闭下拉框
  ok = () => {
    this.props.getSelectVal(this.state.colorVal, this.state.sizeVal)
    // console.log(123)
    // this.setState({
    //   isOpenSelect: false,
    // })
    
  }

  // 点击选择颜色事件
  clickColors = (e) => {
    if(e.target.className) {
      e.target.className = ''
      this.setState({
        colorVal: ''
      })
    } else {
      console.log()
      for (let index = 0; index < this.refs.colors.children.length; index++) {
        const element = this.refs.colors.children[index];
        element.className = ''
      }
      e.target.className = 'active'
      this.setState({
        colorVal: e.target.innerText
      })
    }
  }
  // 点击选择尺寸事件
  clickSizes = (e) => {
    if(e.target.className) {
      e.target.className = ''
      this.setState({
        sizeVal: ''
      })
    } else {
      for (let index = 0; index < this.refs.sizes.children.length; index++) {
        const element = this.refs.sizes.children[index];
        element.className = ''
      }
      e.target.className = 'active'
      this.setState({
        sizeVal: e.target.innerText
      })
    }
  }
}
