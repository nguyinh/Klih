import act from '../../config/actions.constants.js'

const initialState = {
  isConnected: undefined,
  actualPage: ''
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case act.SET_USER_AUTH:
      return Object.assign({}, state, {isConnected: action.payload});
    case act.SET_NAVIGATION_STATE:
      return Object.assign({}, state, {actualPage: action.payload});
    default:
      return state;
  }
}

export default rootReducer;
