module.exports = {
  devServer: (devServerConfig) => {
    // Eski onBeforeSetupMiddleware ve onAfterSetupMiddleware seçeneklerini
    // yeni setupMiddlewares yapısına dönüştür
    if (devServerConfig.onBeforeSetupMiddleware || devServerConfig.onAfterSetupMiddleware) {
      const onBeforeSetupMiddleware = devServerConfig.onBeforeSetupMiddleware;
      const onAfterSetupMiddleware = devServerConfig.onAfterSetupMiddleware;

      delete devServerConfig.onBeforeSetupMiddleware;
      delete devServerConfig.onAfterSetupMiddleware;

      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        if (onBeforeSetupMiddleware) {
          onBeforeSetupMiddleware(devServer);
        }

        // Mevcut middlewares'ları kullan
        if (onAfterSetupMiddleware) {
          onAfterSetupMiddleware(devServer);
        }

        return middlewares;
      };
    }

    return devServerConfig;
  },
};
