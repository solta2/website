const webpack = require("webpack");

module.exports = {
    transpileDependencies: true,
    devServer: {
      host: '0.0.0.0',
      port: 8080,
      headers: {
        'Access-Control-Allow-Origin': '*'            
      },
      proxy: {
        '/pump': {
          target: 'https://frontend-api-v2.pump.fun',
          changeOrigin: true,
          pathRewrite: {
            '^/pump/coins/': '/coins/', // Reescribe la URL para que coincida con el endpoint real
          },
          secure: true, // Si usas HTTPS y tienes problemas de certificado, puedes ponerlo en false (solo en desarrollo)
        },
      },
      compress: true,
      // disableHostCheck: true,   // That solved it
      allowedHosts: "all",
      // allowedHosts: ['213a-2800-484-9a7b-3410-ad88-fe86-58a5-dc70.ngrok-free.app'],
      // client: {
      //   webSocketURL: 'wss://really-popular-finch.ngrok-free.app:8080/ws',  // Usar WSS
      // },
    },
    chainWebpack: config => {
      config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
          options.compilerOptions = {
            ...options.compilerOptions,
            isCustomElement: tag => tag.startsWith('ion-')
          }
          return options
        })
    },
    configureWebpack: {
      plugins: [
          new webpack.ProvidePlugin({
              Buffer: ["buffer", "Buffer"],
          }),
      ],
      resolve: {
          fallback: {
              buffer: require.resolve("buffer"),
          },
      },
    },
  };