import React from 'react'
import '../../../css/Home/List.min.css'
import {Link} from 'react-router-dom'

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      nowList: 0,
      data: []
    };
  }

  componentDidMount() {
    this.getlistData()
  }

  // componentWillReceiveProps (nextProps) {
  //     this.getlistData()
  // }

  onEndReached = (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    this.setState({ isLoading: true });
    
  }


  render() {
    return (
      <div className="home_ListCategory_list">
        <div style={{ padding: '0 15px' }}>
          {this.state.data.map ((item, i) => {
            return (
              <Link to={'/GoodsDetail/' + item.id} className="list_item" key={i} style={{ display: 'flex', padding: '15px 0' }}>
                <div className="img">
                  <img src={item.img} alt="" />
                </div>
                <div className="right" style={{ lineHeight: 1 }}>
                  <h4>{item.name}</h4>
                  <p className="intro"><span>{item.intro}</span></p>
                  <p>
                    <span>{item.merchant}</span> &nbsp;
                    <span className="price">¥{item.price}</span>
                    <span className="time">{item.time}</span>
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
        <div style={{lineHeight: '50px'}} className="nomore">
          没有更多了...
        </div>
      </div>
    )
  }

  getlistData = (a,b) => {
    let title = this.props.nowList
    let page = 1
    let pageSize = 20
    this.$axios.get(`/getRecommendListData/${title}/${page}/${pageSize}`).then(res => {
      let data = res.data.result
      this.setState({
        data: data
      })
    })
  }
}

