const burgerIconVisibility = (state = false, action) => {
  switch(action.type) {
    case 'SET_BURGERICON_VISIBILITY':
      return action.payload
    default:
      return state
  }
}

export default burgerIconVisibility;