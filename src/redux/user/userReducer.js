import * as _ from "./userTypes";

const initialState = {
  loading: false,
  error: null,

  isLoggedIn: false,
  currentUser: {
    username: null,
    passwordHash: null,
  },
  data: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case _.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case _.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // setting the user details when user logs in
    case _.SET_USER:
      return {
        ...state,
        loading: false,
        error: null,

        isLoggedIn: true,
        currentUser: {
          username: action.payload.username,
          passwordHash: action.payload.passwordHash,
        },
        data: action.payload.data,
      };

    // removing the user details from state when logged out
    case _.LOGOUT:
      return {
        ...state,
        loading: false,
        error: null,

        isLoggedIn: false,
        currentUser: {
          username: null,
          passwordHash: null,
        },
        data: null,
      };

    default:
      return state;
  }
};

export default reducer;
