import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const useAppStateCallback = (callback: (state: AppStateStatus) => void) => {
    const [state, setState] = useState<AppStateStatus>();

    useEffect(() => {
        AppState.addEventListener('change', setState);

        return () => {
            AppState.removeEventListener('change', setState);
        };
    }, []);

    useEffect(() => {
        if (state) {
            callback(state);
        }
    }, [state, callback]);
};

export default useAppStateCallback;
