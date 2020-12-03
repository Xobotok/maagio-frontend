module.exports = {
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOpts: {
      runtimeCaching: [
        {
          urlPattern: /^https?.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'offlineCache',
            expiration: {
              maxEntries: 200,
            },
          },
        },
      ],
      importScripts: ['./scripts/sw-push-listener.js'],
    },
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      exclude: [
        /\.map$/,
        /manifest\.json$/,
        '.htaccess'
      ],
    },
  },
};