import { Navigation } from 'lib/utils/navigation';
import { useEffect } from 'react';

type Title = string;

const useScreenTitles = (title: Title, subtitle: Title | undefined, componentId: string) => {
    useEffect(() => {
        Navigation.mergeOptions(componentId, { topBar: { title: { text: title }, subtitle: { text: subtitle } } });
    }, [componentId, title, subtitle]);
};

export default useScreenTitles;
