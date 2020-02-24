import { FC } from 'lib/utils/component';
import { useEffect } from 'react';
import { appRoot } from '../_router';

const Root: FC = () => {
    useEffect(() => {
        appRoot();
    }, []);

    return null;
};

export default Root;
