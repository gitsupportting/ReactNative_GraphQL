interface Obj<T> {
    [key: string]: T;
}

export default <T>(obj: Obj<T>, filter: (value: T, index: number, obj: Obj<T>) => boolean): T | undefined =>
    Object.values(obj).find((entry, index) => filter(entry, index, obj));
