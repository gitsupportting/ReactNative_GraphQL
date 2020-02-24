import { getAuthorisationStatus, Status } from 'react-native-motion-activity';
import { useEffect, useState } from 'react';

const useMotionActivityStatus = () => {
    const [status, setStatus] = useState<Status | undefined>();

    useEffect(() => {
        getAuthorisationStatus().then(setStatus, console.error);
    }, []);

    return status;
};

export default useMotionActivityStatus;
