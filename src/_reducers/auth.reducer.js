import {
  LOGIN_SUCCESS,
  LOGOUT,
} from "../_actions/types";

const user = JSON.parse(localStorage.getItem('login_user'));
const loggedIn = user && user.AccessToken;
const initialState = { isLoggedIn: loggedIn ? true : false, user_token: loggedIn ? loggedIn : '' };

function authReducer (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user_token: payload
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user_token: null,
      };
    default:
      return state;
  }
}

export default authReducer