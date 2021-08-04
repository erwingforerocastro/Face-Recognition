const { nodeResolve } = require('@rollup/plugin-node-resolve');

module.exports = {
    input: 'public/mvfy/demo.js',
    output: {
        file: 'build/mvfy.js',
        format: 'umd'
    },
    plugins: [nodeResolve({
        customResolveOptions: {
            moduleDirectory: 'node_modules'
        }
    })]
};