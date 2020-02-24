import useRightNavigationButton from 'lib/hooks/useRightNavigationButton';
import { Navigation } from 'lib/utils/navigation';
import { useCallback } from 'react';

const useCloseButton = (componentId: string, additionalOptions = {}) => {
    const close = useCallback(() => {
        Navigation.dismissModal(componentId);
    }, [componentId]);

    useRightNavigationButton({ systemItem: 'done', ...additionalOptions }, close, componentId);

    return {
        close,
    };
};

export default useCloseButton;
