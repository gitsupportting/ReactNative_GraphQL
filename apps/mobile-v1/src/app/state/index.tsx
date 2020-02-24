import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';
import middleware from './middleware';
import reducers from './reducers';

const store = createStore(reducers, composeWithDevTools(middleware));

export const persistor = persistStore(store);

export default store;
