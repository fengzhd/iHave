import React from 'react'
import {  Badge } from 'antd-mobile';

import '../../../../css/Components/CategoryDetail/List.min.css'
import '../../../../css/Components/CategoryDetailCat/List.min.css'
export default class List extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      isLoadingMore: false,
      title: '',
      // isLoading: true,
      nowPage: 1,
      pageSize: 8,
      isOver: false
    }
  }

  componentDidMount() {
    const wrapper = this.refs.wrapper;
    const loadMoreDataFn = this.loadMoreDataFn;
    const that = this; // 为解决不同context的问题
    // let timeCount;


    function callback() {
            const top = wrapper.getBoundingClientRect().top;
            const windowHeight = window.screen.height;
            if (top && top < windowHeight + 300) {
              // 当 wrapper 已经被滚动到页面可视范围之内触发
              loadMoreDataFn(that);
            }
    }

    window.addEventListener('scroll', function () {
            if (this.state.isLoadingMore) {
                return ;
            }
            // if (timeCount) {
            //     clearTimeout(timeCount);
            // }
            callback()
            // timeCount = setTimeout(callback, 10);
        }.bind(this), false);
  }
    // 加载更多数据
   loadMoreDataFn(that) {
    // if (that.state.isOver) {
    //   return that.setState({
    //     isOver: false
    //   })
    // }
    that.setState({
      nowPage: that.state.nowPage + 1
    }, () => {
      that.$axios.get(`/getCategoryDetailCatList/${that.state.title}/${that.props.nowListFirstTitle}/${that.props.nowListSecondTitle}/${that.state.nowPage}/${that.state.pageSize}`).then(res => {
        let data1 = res.data.result
        data1.forEach(item => {
          if(item.tags) {
            item.tags = item.tags.split(',')
          }
        })
        if(data1.length === 0) {
          return that.setState({
            isOver: true
          })
        }
        that.setState({
          data: that.state.data.concat(data1)
        })
      })
    })
  }
   getTitle = () => {
    this.setState({
      title: this.props.title
    }, () => {
      this.getCategoryDetailCatList()
    })
  }
  // 获取列表数据
  getCategoryDetailCatList = () => {
    this.$axios.get(`/getCategoryDetailCatList/${this.state.title}/${this.props.nowListFirstTitle}/${this.props.nowListSecondTitle}/${this.state.nowPage}/${this.state.pageSize}`).then(res => {
      let data1 = res.data.result
      if(data1.length === 0) {
         this.setState({
          isOver: true
        })
      }
      data1.forEach(item => {
        if(item.tags) {
          item.tags = item.tags.split(',')
        }
      })
      this.setState({
        data: data1
      });
    })
  }
  componentWillMount () {
    this.getTitle()
  }
  componentWillReceiveProps (val) {
    if(this.props.nowListFirstTitle !== val.nowListFirstTitle || this.props.nowListSecondTitle !== val.nowListSecondTitle) {
      this.setState({
        nowPage: 1,
        isOver: false
      }, () => {
        this.getCategoryDetailCatList()
      })
    }
  }
  render() {
    return(
      <div>
        {(() => {
          if(this.props.showListWay) {
            return(
              <div className="category_detail_list">
                <div className="out_box">
                {this.state.data.map((obj, index) => (
                  <div className="item" key={index}>
                    <div className="img">
                      <img src={obj.img} alt="" />
                    </div>
                    <div className="right">
                      <h5 className="title">
                        {obj.name}
                        {(() => {
                          if(obj.tags) {
                            let arr = []
                            obj.tags.forEach((item, i) => {
                              arr.push(<Badge key={i} text={item} style={{ marginLeft: 12, padding: '0 3px', backgroundColor: '#f00', borderRadius: 2 }} />)
                            })
                            return arr
                          }
                        })()}
                      </h5>
                      <div>{obj.intro}</div>
                      <div className="desc">
                        <span className="price">{obj.price}¥</span>
                        <span className="hits">热度:{obj.hits}</span>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
                <div className="loadMore" ref="wrapper" onClick={this.loadMoreDataFn.bind(this, this)}>{this.state.isOver ? '没有更多了' : '加载更多...'}</div>
              </div>
            )
          } else {
            return(
              <div className="category_detail_list_second">
                <div className="out_box clearfix">
                {this.state.data.map((obj, index) => (
                  <div key={index} className="itemBox">
                    <div className="item" key={index}>
                      <div className="img">
                        <img src={obj.img} alt="" />
                      </div>
                      <div className="right">
                        <h5 className="title">
                          {obj.name}
                          {(() => {
                            if(obj.tags) {
                              let arr = []
                              obj.tags.forEach((item, i) => {
                                arr.push(<Badge key={i} text={item} style={{ marginLeft: 12, padding: '0 3px', backgroundColor: '#f00', borderRadius: 2 }} />)
                              })
                              return arr
                            }
                          })()}
                        </h5>
                        
                        <div className="intro">{obj.intro}</div>
                        <div className="desc">
                          <span className="price">{obj.price}¥</span>
                          <span className="hits">热度:{obj.hits}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
                <div className="loadMore" ref="wrapper" onClick={this.loadMoreDataFn.bind(this, this)}>{this.state.isOver ? '没有更多了' : '加载更多...'}</div>
              </div>
            )
          }
        })()}
      </div>
    ) 
  }
}
