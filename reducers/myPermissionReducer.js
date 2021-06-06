const myPermissionReducer = (state = '', action) => {
  switch(action.type) {
    case 'SET_MYPERMISSION':
      return action.payload
      default:
        return state
  }
}

export default myPermissionReducer;