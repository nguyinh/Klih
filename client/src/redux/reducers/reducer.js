import act from '../../config/actions.constants.js'
import plusImage from './../../plus.png';

const initialState = {
  isConnected: undefined,
  actualPage: '',
  avatar: undefined,
  isStarted: false,
  playerCursor: undefined,
  P1: {
    name: '',
    image: plusImage,
    score: undefined
  },
  P2: {
    name: '',
    image: plusImage,
    score: undefined
  },
  P3: {
    name: '',
    image: plusImage,
    score: undefined
  },
  P4: {
    name: '',
    image: plusImage,
    score: undefined
  }
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case act.SET_USER_AUTH:
      return Object.assign({}, state, {isConnected: action.payload});
    case act.SET_NAVIGATION_STATE:
      return Object.assign({}, state, {actualPage: action.payload});
    case act.SET_AVATAR:
      return Object.assign({}, state, {avatar: action.payload});
    case act.SET_PLAYER_CURSOR:
      return Object.assign({}, state, {playerCursor: action.payload});
    case act.SET_P1:
      return Object.assign({}, state, {P1: action.payload});
    case act.SET_P2:
      return Object.assign({}, state, {P2: action.payload});
    case act.SET_P3:
      return Object.assign({}, state, {P3: action.payload});
    case act.SET_P4:
      return Object.assign({}, state, {P4: action.payload});
    default:
      return state;
  }
}

export default rootReducer;
