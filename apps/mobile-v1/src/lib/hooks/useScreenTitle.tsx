import { Navigation } from 'lib/utils/navigation';
import { useEffect } from 'react';

type Title = string;

const useScreenTitle = (title: Title, componentId: string) => {
    useEffect(() => {
        Navigation.mergeOptions(componentId, { topBar: { title: { text: title } } });
    }, [componentId, title]);
};

export default useScreenTitle;
