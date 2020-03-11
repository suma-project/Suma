process.env.VUE_APP_VERSION = "1.1.0";
module.exports = {
  publicPath: './',
  configureWebpack: {
    devtool: 'source-map',
  },
  filenameHashing: false,
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/sumaserver/*": {
        target: "http://localhost:19679",
        secure: false
      }
    }
  }
}
