const DEBUG = process.env.DEBUG || false;

export const log = (...args: any[]) => DEBUG && console.log(args);

export const error = (...args: any[]) => DEBUG && console.error(args);
