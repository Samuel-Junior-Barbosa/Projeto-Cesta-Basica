// webpack.config.js

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.md'],
        modules: ['node_modules'],
        alias: {
            'react-router-dom': require.resolve('react-router-dom'),
          },
    },
    module: {
        rules: [
          {
            test: /\.md$/,
            use: 'raw-loader',
          },
        ],
    },
}