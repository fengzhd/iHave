import React, { Component } from 'react';
import Tab from './components/tab.jsx'
import CategoryDetail from './components/tabs/Components/CategoryDetail/CategoryDetail.jsx'
import CategoryDetailCat from './components/tabs/Components/CategoryDetailCat/CategoryDetailCat.jsx'
import GoodsDetail from './components/tabs/Components/GoodsDetail/GoodsDetail.jsx'
import Login from './components/tabs/My/Login.jsx'
import Register from './components/tabs/My/Register.jsx'
import Settings from './components/tabs/Components/Settings/Settings.jsx'
import SetUserInfo from './components/tabs/Components/SetUserInfo/SetUserInfo.jsx'
import Setting from './components/tabs/Components/SetUserInfo/Setting.jsx'
import Publish from './components/tabs/Components/Publish/Publish.jsx'
import PublishArticle from './components/tabs/Components/Publish/PublishArticle.jsx'
import ArticleDetail from './components/tabs/Components/Publish/ArticleDetail.jsx'





import {HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import {  connect } from 'react-redux'
import ViewFullText from './components/tabs/Category/ViewFullText.jsx'
class App extends Component {
  render() {
    return(
      <HashRouter>
      <div>
      <Switch>
        <Route path='/' exact render={()=> (
          <Redirect to='/tab/home'/>
          )}
        />
        <Route exact  path='/CategoryDetail/:title' component={CategoryDetail}></Route>
        <Route exact  path='/CategoryDetailCat/:title' component={CategoryDetailCat}></Route>
        <Route exact  path='/GoodsDetail/:id' component={GoodsDetail}></Route>
        <Route exact  path='/login' component={Login}></Route>
        <Route exact  path='/register' component={Register}></Route>
        <Route exact  path='/settings' component={Settings}></Route>
        <Route exact  path='/viewFullText/:id' component={ViewFullText}></Route>
        <Route exact  path='/publish' component={Publish}></Route>
        <Route exact  path='/publishArticle' component={PublishArticle}></Route>
        <Route exact  path='/toArticleDetail/:id' component={ArticleDetail}></Route>


        

        
        <Route exact  path='/setUserInfo' render={(props) => {return (this.props.user.isLogin ? <SetUserInfo {...props} /> : <Redirect to='/tab/my'/>)}}></Route>

        <Route exact  path='/setting/:title' render={(props) => {return (this.props.user.isLogin ? <Setting {...props} /> : <Redirect to='/tab/my'/>)}}></Route>

        <Route path='/Tab' component={Tab}></Route>
        </Switch>
      </div>
      </HashRouter>
      )
  }
}

function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    removeUserInfo () {
      dispatch({
        type: 'REMOVE_USER_INFO',
      })
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)


// export default App;
