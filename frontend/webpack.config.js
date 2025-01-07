// webpack.config.js

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        modules: ['node_modules'],
        alias: {
            'react-router-dom': require.resolve('react-router-dom'),
          },
    }
}