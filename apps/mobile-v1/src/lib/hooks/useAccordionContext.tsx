import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Setter = (value: number | string) => void;

const Context = createContext<{ value: number | string; setValue: Setter }>({ value: -1, setValue: _ => undefined });

export const AccordionContext = ({
    initialValue,
    children,
}: {
    initialValue?: number | string;
    children: React.ReactChild;
}) => {
    const [value, setValue] = useState(initialValue || -1);

    const providedContext = useMemo(() => ({ value, setValue }), [value, setValue]);

    return <Context.Provider value={providedContext}>{children}</Context.Provider>;
};

const useAccordionContext = (id: number | string) => {
    const { setValue, value } = useContext(Context);
    const handleSetValue = useCallback(() => {
        setValue(value === id ? -1 : id);
    }, [setValue, value, id]);

    return [value === id, handleSetValue] as const;
};

export default useAccordionContext;
