import { createStore, applyMiddleware } from "redux";
// for testing & debugging purposes
// import { composeWithDevTools } from "redux-devtools-extension";
// import logger from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from "./rootReducer";

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
  // composeWithDevTools(applyMiddleware(logger, thunk))
);

export default store;
