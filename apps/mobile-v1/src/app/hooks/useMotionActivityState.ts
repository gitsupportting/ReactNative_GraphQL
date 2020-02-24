import { subscribe, Activity } from 'react-native-motion-activity';
import { useEffect, useState } from 'react';

const useMotionActivityState = () => {
    const [status, setStatus] = useState<Activity | undefined>();

    useEffect(() => subscribe(setStatus), []);

    return status;
};

export default useMotionActivityState;
