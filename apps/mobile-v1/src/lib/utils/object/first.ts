interface Obj<T> {
    [key: string]: T;
}

export default <T>(obj: Obj<T>): T | undefined => Object.values(obj)[0];
