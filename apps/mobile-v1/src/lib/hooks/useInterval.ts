import { useCallback, useEffect, useState } from 'react';

const useInterval = (callback: () => void, interval: number) => {
    const [paused, setPaused] = useState(false);
    const init = useCallback(() => {
        if (paused) {
            return;
        }

        const intervalId = setInterval(callback, interval);

        return () => {
            clearInterval(intervalId);
        };
    }, [callback, interval, paused]);

    useEffect(init, [init]);

    const pause = useCallback((pause_ = true) => {
        setPaused(pause_);
    }, []);

    return { pause };
};

export default useInterval;
