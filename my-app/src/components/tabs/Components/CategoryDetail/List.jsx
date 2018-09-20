import React from 'react'
import '../../../../css/Components/CategoryDetail/List.min.css'
import {Link} from 'react-router-dom'
export default class List extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      isLoadingMore: false,
      title: '',
      isLoading: true,
      nowPage: 1,
      pageSize: 20,
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
      that.$axios.get(`/getCategoryDetailList/${that.state.title}/${that.props.nowList}/${that.state.nowPage}/${that.state.pageSize}`).then(res => {
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
   getTitle = () => {
    this.setState({
      title: this.props.title
    }, () => {
      this.getCategoryDetailList()
    })
  }
  // 获取列表数据
  getCategoryDetailList = () => {
    console.log('加载数据了')
    this.$axios.get(`/getCategoryDetailList/${this.state.title}/${this.props.nowList}/${this.state.nowPage}/${this.state.pageSize}`).then(res => {
      let data1 = res.data.result
      this.setState({
        data: data1
      });
    })
  }
  componentWillMount () {
    this.getTitle()
  }
  componentWillReceiveProps (val) {
    if(this.props.nowList !== val.nowList) {
      this.setState({
        nowPage: 1
      }, () => {
        this.getCategoryDetailList()
      })
    }
  }
  render() {
    return(
      <div className="category_detail_list">
        <div className="out_box">
        {this.state.data.map((obj, index) => (
           <Link to={'/GoodsDetail/' + obj.id} className="item" key={index}>
            <div className="img">
              <img src={obj.img} alt="" />
            </div>
            <div className="right">
              <h5 className="title">{obj.name}</h5>
              <div className="desc">
                <span className="price">{obj.price}¥</span>
                <span className="hits">热度:{obj.hits}</span>
              </div>
            </div>
          </Link>
          ))}
        </div>
        <div className="loadMore" ref="wrapper" onClick={this.loadMoreDataFn.bind(this, this)}>{this.state.isOver ? '没有更多了' : '加载更多...'}</div>
      </div>
    ) 
  }
}
