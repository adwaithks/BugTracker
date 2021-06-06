const expandedReducer = (state = true, action) => {
  switch(action.type) {
    case 'SET_EXPANDED':
      return action.payload
      default:
        return state
  }
}

export default expandedReducer;