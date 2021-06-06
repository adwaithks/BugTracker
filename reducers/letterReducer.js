const letterReducer = (state = '', action) => {
  switch(action.type) {
    case 'SET_LETTER':
      return action.payload
      default:
        return state
  }
}

export default letterReducer;