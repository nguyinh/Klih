import action from '../../config/actions.constants.js'

// let nextProductId = 0;
// export const addProduct = content => ({
//   type: act.ADD_PRODUCT,
//   payload: {
//     id: ++nextProductId,
//     content
//   }
// });

export const setUserAuth = content => ({type: action.SET_USER_AUTH, payload: content});

export const setNavigationState = content => ({type: action.SET_NAVIGATION_STATE, payload: content});

export const setAvatar = content => ({type: action.SET_AVATAR, payload: content});
//
// export const setAppStarting = content => ({
//   type: act.SET_APP_STARTING,
//   payload: content
// });
//
// export const setToken = content => ({
//   type: act.SET_TOKEN,
//   payload: content
// });
//
// export const setSocket = content => ({
//   type: act.SET_SOCKET,
//   payload: content
// });