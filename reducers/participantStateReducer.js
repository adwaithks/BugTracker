const myPermissionReducer = (state = [], action) => {
  switch(action.type) {
    case 'SET_PARTICIPANT':
      return action.payload
      default:
        return state
  }
}

export default myPermissionReducer;