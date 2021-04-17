import * as _ from "./userTypes";

const initialState = {
  loading: true,
  error: null,

  currentUser: {
    username: null,
    passwordHash: null,
  },
  data: null,

  isLoggedIn: false,
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
    case _.SET_USER:
      return {
        ...state,
        loading: false,
        currentUser: {
          username: action.payload.username,
          passwordHash: action.payload.passwordHash,
        },
        data: action.payload.data,
      };
    default:
      return state;
  }
};

export default reducer;
