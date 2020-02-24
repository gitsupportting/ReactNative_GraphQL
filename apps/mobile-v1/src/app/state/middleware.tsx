import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import logger from 'redux-logger';

const middlewares = __DEV__ ? [thunk, apiMiddleware, logger] : [thunk, apiMiddleware];

export default applyMiddleware(...middlewares);
