# suma-client

## Project setup
```
npm install
```

### Set up development environment
In order to support development using the live compliling, hot-reload and debugging features, some additional setup is required.  Defaults for a typical suma-vagrant box are provided.

1. Edit the file, `./vue.config.js`, to proxy requests to your sumaserver.  A default target value of `http://localhost:19679` is given.
2. 
    ```
    cp public/config/spaceassessConfig_example.js public/config/spaceassessConfig.js
    ```
3. Edit the file you just copied to point at the api endpoints on your sumaserver for baseInitUrl, initiativeUrl, and syncUrl. Default values are provided.


### Compiles and hot-reloads for development
```
npm run serve
```
Navigate to [`http://localhost:8080/`](http://localhost:8080/) to see your hot-reload enabled app.

For debugging setup, see [this guide](https://vuejs.org/v2/cookbook/debugging-in-vscode.html) on debugging vuejs apps in Chrome or Firefox w/VSCode.

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Lints scss in vue files
```
npm run lint:css
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
