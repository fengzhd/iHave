import React from 'react'
import '../../../css/Category/List.min.css'
import {Link} from 'react-router-dom'
export default class List extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      isLoadingMore: false,
      isLoading: true,
      nowPage: 1,
      pageSize: 10,
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
    if (that.state.isOver) {
      return that.setState({
        isLoading: false
      })
    }
    that.setState({
      nowPage: that.state.nowPage + 1
    }, () => {
      that.$axios.get(`/getArticle/${that.state.nowPage}/${that.state.pageSize}`).then(res => {
        let data1 = res.data.result
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
  // 获取列表数据
  getCategoryDetailList = () => {
    console.log('加载数据了')
    this.$axios.get(`/getArticle/${this.state.nowPage}/${this.state.pageSize}`).then(res => {
      let data1 = res.data.result
      this.setState({
        data: data1
      });
    })
  }
  componentWillMount () {
    this.getCategoryDetailList()
  }
  // componentWillReceiveProps (val) {
  //   if(this.props.nowList !== val.nowList) {
  //     this.setState({
  //       nowPage: 1
  //     }, () => {
  //       this.getCategoryDetailList()
  //     })
  //   }
  // }
  render() {
    return(
      <div className="Category_list">
        <div className="out_box">
        {this.state.data.map((item, index) => (
            <div className="item" key={index}>
              <div className="left">
                <div>
                  <img src={item.headerImg} alt=""/>
                </div>
              </div>
              <div className="right">
                <div className="title">
                  <div>
                    <h5>
                      {item.username}
                    </h5>
                    <p>{item.ctime}</p>
                  </div>
                  <h5 className="attention">关注</h5>
                </div>
                <div className="text">
                  <div dangerouslySetInnerHTML = {{ __html:item.content }}></div>
                </div>
                <Link style={{color: '#df2924'}} to={'/viewFullText/'+item.id}>全文</Link>
              </div>
            </div>
          ))}
          
        </div>
        <div className="loadMore" ref="wrapper" onClick={this.loadMoreDataFn.bind(this, this)}>{this.state.isOver ? '没有更多了' : '加载更多...'}</div>
      </div>
    ) 
  }
}
