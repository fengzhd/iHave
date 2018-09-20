function App(state, action) {
  switch (action.type) {
    case 'SET_USER_INFO':
      return Object.assign({}, state, {
        user: {
          isLogin: action.data.isLogin,
          info: {
            ...action.data.info
          }
        }
      })
    case 'REMOVE_USER_INFO':
      return Object.assign({}, state, {
        user: {
          isLogin: false,
          info: {}
        }
      })
    default:
      return state  // 没有匹配的action type，返回原来的state
  }
}


export default App
