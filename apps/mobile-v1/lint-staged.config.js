const path = require('path');

const cwd = __dirname;

const iosDir = path.resolve(cwd, 'ios');
const androidDir = path.resolve(cwd, 'android');
const appVersionFiles = [
    path.resolve(androidDir, 'app/build.gradle'),
    path.resolve(iosDir, 'Kora/Info.plist'),
    path.resolve(iosDir, 'KoraTests/Info.plist'),
];

module.exports = {
    '**/{src,ios,android}/**/*': () => ['yarn increment-version', `git add ${appVersionFiles.join(' ')}`],
    '*.{js,jsx,ts,tsx}': filenames => [`prettier --write ${filenames.join(' ')}`, `eslint ${filenames.join(' ')}`],
};
