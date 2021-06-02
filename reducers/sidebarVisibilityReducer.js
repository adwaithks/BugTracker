const sidebarVisibility = (state = true, action) => {
  switch(action.type) {
    case 'SET_SIDEBAR_VISIBILITY':
      return action.payload
    default:
      return state
  }
}

export default sidebarVisibility;