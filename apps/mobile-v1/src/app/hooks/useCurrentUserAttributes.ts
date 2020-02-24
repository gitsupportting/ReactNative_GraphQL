import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import useCurrentUser from './useCurrentUser';

interface Attributes {
    email?: string;
}

const useCurrentUserAttributes = () => {
    const { user } = useCurrentUser();
    const [attributes, setAttributes] = useState<Attributes>({});
    const [state, forceUpdate] = useReducer(i => i + 1, 0);

    useEffect(() => {
        if (user) {
            user.getUserAttributes((err, result) => {
                if (err) {
                    return;
                }

                const attr: Attributes = {};
                if (result) {
                    for (let attribute of result) {
                        attr[attribute.getName() as keyof Attributes] = attribute.getValue();
                    }
                }

                setAttributes(attr);
            });
        }
    }, [user, state]);

    const setAttribute = useCallback(
        (name: string, value: string) =>
            new Promise((resolve, reject) => {
                if (!user) {
                    reject(new Error("No current user available. Can't update attribute"));
                    return;
                }

                user.updateAttributes([{ Name: name, Value: value }], err => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    forceUpdate();
                    resolve();
                });
            }),
        [user],
    );

    return useMemo(() => ({ attributes, setAttribute } as const), [attributes, setAttribute]);
};

export default useCurrentUserAttributes;
