const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');
const cwd = path.resolve(__dirname);
const glob = require('glob');

function flatten(list) {
    return list.reduce((acc, item) => {
        if (Array.isArray(item)) {
            return acc.concat(flatten(item));
        } else {
            return acc.concat(item);
        }
    }, []);
}

function getWorkspaces() {
    const root = path.resolve(cwd, '../..');
    const { workspaces } = require(path.join(root, 'package.json'));
    return flatten(workspaces.packages.map(name => glob.sync(path.join(root, name))));
}

const excludedPackages = ['mobile-v1'];
const workspaces = getWorkspaces(__dirname).filter(dir => !excludedPackages.some(excluded => dir.includes(excluded)));

const noHoistDependencies = (() => {
    const { workspaces } = require('./package.json');
    const nohoist = workspaces && workspaces.nohoist ? workspaces.nohoist : [];
    return ['react-native', 'react', ...nohoist];
})();

const extraBlacklistDirs = [path.resolve(cwd, '../api/amplify')];

function getBlacklist() {
    const rootPath = path.resolve(cwd, '../..');
    const directories = [rootPath].concat(workspaces);
    const blacklistPaths = noHoistDependencies
        .map(dependency => directories.map(dir => `${dir}/node_modules/${dependency}/.*`))
        .concat([extraBlacklistDirs.map(dir => `${dir}/.*`)])
        .reduce((acc, value) => [...acc, ...value], [])
        .map(dir => new RegExp(dir.replace(/\//g, path.sep)));

    return blacklist(blacklistPaths);
}

function getExtraNodeModules() {
    return noHoistDependencies.reduce((obj, dep) => {
        obj[dep] = path.resolve(cwd, `./node_modules/${dep}`);
        return obj;
    }, {});
}

module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: true,
                inlineRequires: true,
            },
        }),
    },
    resolver: {
        blacklistRE: getBlacklist(),
        extraNodeModules: getExtraNodeModules(),
    },
    watchFolders: [path.resolve(cwd, '../..', 'node_modules')].concat(workspaces),
};
