import AsyncStorage from '@react-native-community/async-storage';
import { store as auth } from 'app/features/auth';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
    [auth.constants.NAME]: persistReducer(
        {
            key: auth.constants.NAME,
            storage: AsyncStorage,
            whitelist: ['phoneNumber', 'registered'],
            version: 1,
        },
        auth.reducer,
    ),
});

export default persistReducer(
    {
        key: 'root',
        storage: AsyncStorage,
        blacklist: [auth.constants.NAME],
        version: 1,
    },
    rootReducer,
);
