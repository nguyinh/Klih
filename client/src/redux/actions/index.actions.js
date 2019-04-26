import action from '../../config/actions.constants.js'

export const setUserAuth = content => ({type: action.SET_USER_AUTH, payload: content});

export const setNavigationState = content => ({type: action.SET_NAVIGATION_STATE, payload: content});

export const setAvatar = content => ({type: action.SET_AVATAR, payload: content});

export const setPlayerCursor = content => ({type: action.SET_PLAYER_CURSOR, payload: content});

export const setP1 = content => ({type: action.SET_P1, payload: content});

export const setP2 = content => ({type: action.SET_P2, payload: content});

export const setP3 = content => ({type: action.SET_P3, payload: content});

export const setP4 = content => ({type: action.SET_P4, payload: content});

export const setMatch = content => ({type: action.SET_MATCH, payload: content});

export const setScore1 = content => ({type: action.SET_SCORE1, payload: content});

export const setScore2 = content => ({type: action.SET_SCORE2, payload: content});

export const setHistory = content => ({type: action.SET_HISTORY, payload: content});

export const addToMatch = content => ({type: action.ADD_TO_MATCH, payload: content});

export const setElapsedTime = content => ({type: action.SET_ELAPSED_TIME, payload: content});

export const setStartTimestamp = content => ({type: action.SET_START_TIMESTAMP, payload: content});
