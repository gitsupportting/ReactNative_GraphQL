module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: [
                    '.ios.js',
                    '.android.js',
                    '.js',
                    '.jsx',
                    '.ts',
                    '.tsx',
                    '/index.ts',
                    '/index.tsx',
                    '/index.js',
                    '/index.jsx',
                    '.json',
                    '',
                ],
                alias: { 'test/*': './test/' },
            },
        ],
        [
            'react-intl',
            {
                messagesDir: './src/translations/',
                // removeDefaultMessage: true,
                moduleSourceName: 'lib/i18n',
            },
        ],
        [
            'babel-plugin-styled-components',
            {
                ssr: false,
                pure: true,
            },
        ],
    ],
};
