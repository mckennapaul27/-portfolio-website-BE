module.exports = {
    webpack: (config, webpack) => {
        const definePlugin = new webpack.DefinePlugin({
            CLIENT_URL: JSON.stringify(process.env.CLIENT_URL),
            CLIENT_PREVIEW_SECRET: JSON.stringify(
                process.env.CLIENT_PREVIEW_SECRET
            ),
        });
        config.plugins.push(definePlugin);
        return config;
    },
};
