const burgerIconReducer = (state = false, action) => {
  switch(action.type) {
    case 'SET_BURGERICON':
      return action.payload
    default:
      return state
  }
}

export default burgerIconReducer;