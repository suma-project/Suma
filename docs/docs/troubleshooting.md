# Troubleshooting

## Configuration Errors

### Server Environment
* Suma depends upon a number of PHP libraries that are often named different things in different server environments. If you are experiencing unexpected issues after installing Suma, please check your server logs for clues to missing PHP modules.

### Suma Server Configuration
* Issues with the `SUMA_SERVER_PATH` will be reported as a `Possible error in SUMA_SERVER_PATH`.

* An `Invalid controller specified (error)` may indicate an issue with the `SUMA_CONTROLLER_PATH` and will also be reported as a `Possible error in SUMA_CONTROLLER_PATH`. 	

* Issues `SUMA_BASE_URL` will be reported as a `404 Not Found` error.

## GitHub Issues

[Closed Suma issues](https://github.com/cazzerson/Suma/issues) on Github may also be a good source of information for troubleshooting your installation.
