import { useState } from 'react';

const useControlledInput = <T extends unknown = string>(defaultValue: T) => {
    const [value, setValue] = useState(defaultValue);

    return [value, setValue] as const;
};

export default useControlledInput;
