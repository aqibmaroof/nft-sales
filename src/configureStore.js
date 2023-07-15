import { applyMiddleware, compose, createStore } from "redux";
import rootReducers from "./reducers";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
// import rootSaga from '../sagas/index';

import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/es/storage";
// import rootReducers from 'app/reducers';

const config = {
  key: "root",
  storage,
  whitelist: [],
  // debug: true //to get useful logging
};
// -----------------------FROM PREVIOUS-------------------------------//
const history = createBrowserHistory();

// -----------------------FROM PREVIOUS-------------------------------//
const middleware = [];
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
middleware.push(sagaMiddleware);
middleware.push(routeMiddleware);

const reducers = persistCombineReducers(config, rootReducers(history));
const enhancers = [applyMiddleware(...middleware)];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = { enhancers };
//export default function configureStore(initialState) {
const configureStore = () => {
  const store = createStore(
    reducers,
    undefined,
    composeEnhancers(applyMiddleware(...middleware))
  );

  const persistor = persistStore(store, persistConfig, () => {
  });

  // sagaMiddleware.run(rootSaga);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers");
      store.replaceReducer(nextRootReducer);
    });
  }
  return { persistor, store };
};

export default configureStore;

export { history };
