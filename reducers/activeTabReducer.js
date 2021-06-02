const activeTabReducer = (state = 'dashboard', action) => {
  switch(action.type) {
    case 'SET_ACTIVETAB':
      return action.payload
    default:
      return state
  }
}

export default activeTabReducer;