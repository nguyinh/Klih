import act from '../../config/actions.constants.js'
import plusImage from './../../plus.png';

const initialState = {
  isConnected: undefined,
  actualPage: '',
  avatar: undefined,
  currentUser: {},
  isStarted: false,
  playerCursor: undefined,
  P1: {
    name: '',
    image: plusImage,
    score: undefined,
    _id: undefined
  },
  P2: {
    name: '',
    image: plusImage,
    score: undefined,
    _id: undefined
  },
  P3: {
    name: '',
    image: plusImage,
    score: undefined,
    _id: undefined
  },
  P4: {
    name: '',
    image: plusImage,
    score: undefined,
    _id: undefined
  },
  // match: {
  //   score1: 0,
  //   score2: 0,
  //   history: [],
  //   minutesElapsed: 0,
  //   startTimestamp: ''
  // },
  // team1: [],
  // team2: [],
  // score1: 0,
  // score2: 0,
  // matchHistory: [],
  // minutesElapsed: 0,
  // startTimestamp: '',
  currentMatchId: ''
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case act.SET_USER_AUTH:
      return Object.assign({}, state, {isConnected: action.payload});
    case act.SET_USER:
      return Object.assign({}, state, {currentUser: action.payload});
    case act.RESET_USER_SESSION:
      return Object.assign({}, state, {
        isConnected: false,
        currentUser: {},
        avatar: undefined,
        playerCursor: '',
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
        },
        // score1: 0,
        // score2: 0,
        // matchHistory: [],
        // minutesElapsed: 0,
        // startTimestamp: '',
        currentMatchId: ''
      });
    case act.SET_NAVIGATION_STATE:
      return Object.assign({}, state, {actualPage: action.payload});
    case act.SET_AVATAR:
      return Object.assign({}, state, {
        currentUser: {
          ...state.currentUser,
          avatar: action.payload
        }
      });
    case act.SET_PLAYER_CURSOR:
      return Object.assign({}, state, {playerCursor: action.payload});
    case act.SET_P1:
      return Object.assign({}, state, {
        P1: action.payload,
        playerCursor: (
          action.payload.name
          ? 'P2'
          : 'P1')
      });
    case act.SET_P2:
      return Object.assign({}, state, {
        P2: action.payload,
        playerCursor: (
          action.payload.name
          ? 'P3'
          : 'P2')
      });
    case act.SET_P3:
      return Object.assign({}, state, {
        P3: action.payload,
        playerCursor: (
          action.payload.name
          ? 'P4'
          : 'P3')
      });
    case act.SET_P4:
      return Object.assign({}, state, {P4: action.payload});
    case act.SET_MATCH:
      return Object.assign({}, state, {match: action.payload});
    case act.SET_SCORE1:
      return Object.assign({}, state, {score1: action.payload});
    case act.SET_SCORE2:
      return Object.assign({}, state, {score2: action.payload});
    case act.SET_HISTORY:
      return Object.assign({}, state, {matchHistory: action.payload});
    case act.SET_ELAPSED_TIME:
      return Object.assign({}, state, {minutesElapsed: action.payload});
    case act.SET_START_TIMESTAMP:
      return Object.assign({}, state, {startTimestamp: action.payload});
    case act.SET_MATCH_ID:
      return Object.assign({}, state, {currentMatchId: action.payload});
      // case act.ADD_TO_MATCH:
      //   return Object.assign({}, state, {
      //     ...state,
      //     match: {
      //       ...state.match,
      //       history: [
      //         ...state.match.history,
      //         action.payload
      //       ]
      //     }
      //   });
    default:
      return state;
  }
}

export default rootReducer;
