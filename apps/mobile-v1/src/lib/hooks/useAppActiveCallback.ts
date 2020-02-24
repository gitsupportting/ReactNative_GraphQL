import useAppStateCallback from 'lib/hooks/useAppStateCallback';
import { useCallback } from 'react';

const useAppActiveCallback = (callback: () => void) => {
    useAppStateCallback(
        useCallback(
            state => {
                if (state === 'active') {
                    callback();
                }
            },
            [callback],
        ),
    );
};

export default useAppActiveCallback;
