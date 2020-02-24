import { Navigation, Options } from 'lib/utils/navigation';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';

type Opts = Omit<Required<Required<Options>['topBar']>['rightButtons'][0], 'id'> & { id?: string };

const useRightNavigationButton = (options: Opts | string, callback: () => void, componentId: string) => {
    const opts = typeof options === 'string' ? { id: options, text: options } : options;
    const id = opts.id || 'Right:' + ((opts && opts.text) || 'unknown');

    Navigation.mergeOptions(componentId, { topBar: { rightButtons: [{ id, ...opts }] } });

    useNavigationButtonPress(callback, componentId, id);
};

export default useRightNavigationButton;
