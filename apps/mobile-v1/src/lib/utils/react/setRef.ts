import { MutableRefObject, Ref } from 'react';

export default <T extends {}>(ref: Ref<T>, value: T) => {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref !== null) {
        (ref as MutableRefObject<T>).current = value;
    }
};
