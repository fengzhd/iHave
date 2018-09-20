import React from 'react'
import { NavBar, Stepper, SwipeAction   } from 'antd-mobile';
import '../../../css/ShoppingCar/ShoppingCar.min.css'


export default class ShoppingCar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSelectAll: false,
      val: 3,
      totalPrice: 0,
      cart: []

    }
  }

  componentDidMount () {
    this.getCarInfo()
  }



  render() {
    return(
      <div className="shoppingCar">
        <div className="navBar">
          <NavBar
            mode="light"
          >
            购物车
          </NavBar>
        </div>
        <div className="cartList">
          {this.state.cart.map((item, i) => {
            return(
              <SwipeAction
                style={{ backgroundColor: 'gray' }}
                autoClose
                right={[
                  {
                    text: 'Delete',
                    onPress: this.delete.bind(this, item.tabid),
                    style: { backgroundColor: '#F4333C', color: 'white' },
                  },
                ]}
                key={i}
              >
                
                  <div className="cartItem">
                    <div className="left">
                      <i onClick={this.selectItem.bind(this,item.tabid)} className={ item.isSelect ? 'selectAll iconfont' : 'iconfont'}>{item.isSelect ? '\ue8bf' : '\ue8df'}</i>
                    </div>
                    <div className="img">
                      <img src={item.img} alt=""/>
                    </div>
                    <div className="right">
                      <h3>{item.name}</h3>
                      <p>
                        <span>颜色: {item.color}</span>
                        <span>尺码: {item.size}</span>
                      </p>
                      <div className="totalPrice">
                        <div className="unitPrice"><i>价格</i> : ¥{item.price}</div>
                        <div className="stepper">
                          <Stepper
                            style={{ width: '100%', minWidth: '100px' }}
                            showNumber
                            max={10}
                            min={1}
                            value={item.count}
                            onChange={this.onChange.bind(this,item.tabid)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              </SwipeAction>
            )
          })}
        </div>
        <div className="toPay">
          <div className="all" onClick={this.isSelectAll}>
            {/* <span className={this.state.isSelectAll ? 'selectAll' : ''}>1</span> */}
            <i className={ this.state.isSelectAll ? 'selectAll iconfont' : 'iconfont'}>{this.state.isSelectAll ? '\ue8bf' : '\ue8df'}</i>
            全选
          </div>
          <div>
            合计:
            <span>¥{this.state.totalPrice}</span>
          </div>
          <div onClick={this.goPay}>
            结算<span>{this.state.totalPrice}</span>
          </div>
        </div>
      </div>
    )
      
    
  }
  // 全选
  isSelectAll = () => {
    // 改变全选状态
    this.setState({
      isSelectAll: !this.state.isSelectAll
    }, () => {
      // 同步每项的选择状态
      let arr = []
      this.state.cart.forEach(item => {
        item.isSelect = this.state.isSelectAll
        arr.push(item)
      })
      this.setState({
        cart: arr
      }, () => {
        // 计算总价
        let totalPrice = 0
        this.state.cart.forEach(item => {
          if(item.isSelect) {
            totalPrice += item.price * item.count
          }
        })
        // 设置总价
        this.setState({
          totalPrice: totalPrice
        })
      })
    })
  }


  // 选择物品
  selectItem = (id) => {
    this.setState((val) => ({
      cart: val.cart.map(item => {
        if(id === item.tabid) {
          return {
            ...item,
            isSelect: !item.isSelect
          }
        }
        return item
      })
    }), () => {
      // 计算总价
      let totalPrice = 0
      this.state.cart.forEach(item => {
        if(item.isSelect) {
          totalPrice += item.price * item.count
        }
      })
      // 设置总价
      this.setState({
        totalPrice: totalPrice
      })
    })
  }



  // 修改数量
  onChange = (id,count) => {
    this.setState((val) => ({
      cart: val.cart.map(item => {
        if(id === item.tabid) {
          return {
            ...item,
            count: count
          }
        }
        return {...item}
      })
    }),() => {
      // 计算总价
      let totalPrice = 0
      this.state.cart.forEach(item => {
        if(item.isSelect) {
          totalPrice += item.price * item.count
        }
      })
      // 设置总价
      this.setState({
        totalPrice: totalPrice
      },)
    })

    this.$axios.get(`/updateCount/${id}/${count}`).then(res => {
      console.log(res)
    })

  }
  
  // 删除
  delete = (id) => {
    let arr = []
    this.state.cart.forEach(item => {
      if(id === item.tabid) {
        return false
      }
      arr.push(item)
    })
    this.setState({
      cart: arr
    })

    this.$axios.get('/deleteGoodsFromCar/' + id).then(res => {
      console.log(res)
    })
  }

  // 去结算
  goPay = () => {
    console.log('去结算')
  }
  // 获取数据
  getCarInfo = () => {
    this.$axios.get('/getCarInfo').then(res => {
      if(res.data.status === 200) {
        this.setState({
          cart: res.data.result
        })
      }
    })
  }
}
