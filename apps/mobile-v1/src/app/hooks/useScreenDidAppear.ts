import { useEffect } from 'react';
import { Navigation } from 'lib/utils/navigation';

const useScreenDidAppear = (componentId: string, callback: () => void) => {
    useEffect(() => {
        const screenEventListener = Navigation.events().registerComponentDidAppearListener(
            ({ componentId: appearedComponentId }) => {
                if (appearedComponentId === componentId) {
                    callback();
                }
            },
        );

        return () => {
            screenEventListener.remove();
        };
    }, [componentId, callback]);
};

export default useScreenDidAppear;
