import { createStore, applyMiddleware, combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createLogger from 'redux-logger';
import authReducers from './auth/reducers';
import rootSaga from './auth/sagas';

const loggerMiddleware = createLogger();

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    combineReducers({
      auth: authReducers,
      // routing: routerReducer
    }),
    initialState,
    applyMiddleware(
      sagaMiddleware,
      loggerMiddleware
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
