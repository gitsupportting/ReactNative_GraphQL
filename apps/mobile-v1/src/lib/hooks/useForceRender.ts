import { useReducer } from 'react';

const useForceRender = () => {
    const [, force] = useReducer(prev => prev + 1, 0);

    return force;
};

export default useForceRender;
