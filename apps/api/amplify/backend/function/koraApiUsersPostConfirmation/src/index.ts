/*
   this file will loop through all js modules which are uploaded to the lambda resource,
   provided that the file names (without extension) are included in the "MODULES" env variable.
   "MODULES" is a comma-delimmited string.
 */

const getModule = async (module: string) => {
    switch (module) {
        case 'custom':
            return (await import('./custom')).default;
        default:
            return Promise.reject('unknown module ' + module);
    }
};

export const handler = async (event: any) => {
    const modules = process.env.MODULES!.split(',');

    return Promise.race(modules.map(async module => (await getModule(module))(event)));
};
