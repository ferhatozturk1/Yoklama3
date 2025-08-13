module.exports = {
  devServer: {
    // WebSocket yapılandırması
    client: {
      webSocketURL: {
        hostname: 'localhost',
        pathname: '/ws',
        port: 3001,
        protocol: 'ws',
      },
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    // Hot reload ayarları
    hot: true,
    liveReload: true,
    port: 3001,
    host: 'localhost',
    
    // Deprecated middleware uyarılarını çözmek için
    setupMiddlewares: (middlewares, devServer) => {
      // Middleware kurulumu burada yapılabilir
      return middlewares;
    },
  },
  
  webpack: {
    configure: (webpackConfig) => {
      // WebSocket bağlantı ayarları için
      if (webpackConfig.mode === 'development') {
        webpackConfig.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
      return webpackConfig;
    },
  },
};
