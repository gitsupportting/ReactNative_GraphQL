interface Obj<T> {
    [key: string]: T;
}

export default <T>(obj: Obj<T>, filter: (value: T, index: number, obj: Obj<T>) => boolean) =>
    Object.fromEntries(Object.entries(obj).filter((entry, index) => filter(entry[1], index, obj)));
