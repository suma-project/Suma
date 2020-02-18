process.env.VUE_APP_VERSION = "1.1.0";
module.exports = {
  publicPath: './',
  configureWebpack: {
    devtool: 'source-map',
    output: {
  	  filename: 'js/sumaClient.js'
  	}
  },
  devServer: {
    proxy: {
      "/sumaserver/*": {
        target: "http://localhost:19679",
        secure: false
      }
    }
  }
}
