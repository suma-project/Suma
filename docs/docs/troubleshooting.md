# Troubleshooting

## Client Errors

### iOS WebSQL error

* The latest versions of iOS deprecates WebSQL which the Suma client depends on to
  work.
    * If you are using iOS version 15 or above, and are running into an error in the Suma collection client that says "Error in browser (Web SQL) database setup...", you need to [upgrade your Suma Client](upgrade_client.md).
    * If you are using iOS version 13 or 14, and are running into the error above, see the bottom of this page for a workaround to turn WebSQL back on: <https://blog.appstudio.dev/2019/09/the-future-of-sqlite/>

## Configuration Errors

### Server Environment
* Suma depends upon a number of PHP libraries that are often named different things in different server environments. If you are experiencing unexpected issues after installing Suma, please check your server logs for clues to missing PHP modules.

### Suma Server Configuration
* Issues with the `SUMA_SERVER_PATH` will be reported as a `Possible error in SUMA_SERVER_PATH`.

* An `Invalid controller specified (error)` may indicate an issue with the `SUMA_CONTROLLER_PATH` and will also be reported as a `Possible error in SUMA_CONTROLLER_PATH`.

* Issues `SUMA_BASE_URL` will be reported as a `404 Not Found` error.

## Suma on SELinux

### Suma Log Path

Ordinarily to set up read/write permissions on the log path, you just need to identify the group that the apache user belongs to, add the log file and its parent folders to that group, and then give the group write permissions. Something like this:

```
chgrp apache /var/www/html/suma
chmod 775 /var/www/html/suma
```

```
chgrp apache /var/www/html/suma/log
chmod 775 /var/www/html/suma/log
```

```
touch /var/www/html/suma/log/sumaserver.log
chgrp apache /var/www/html/suma/log/sumaserver.log
chmod 775 /var/www/html/suma/log/sumaserver.log
```

That assumes that your apache user’s group is “apache” (on Debian-based systems the default is www-data), and that the path to your Suma client installation is /var/www/html/suma (which will vary according to where you installed it). Ordinarily, that would be enough, and the file should be there and writable.

But in the case of SELinux, there is a complication. SELinux is a security layer used by Red Hat Enterprise Linux and CentOS. Among other things, SELinux restricts read/write access to files by the Apache process even when the file permissions are otherwise correct, which cause Suma not to work correctly.

Correcting it requires running some additional commands:

```
chcon -t httpd_sys_rw_content_t /var/www/html/suma
chcon -t httpd_sys_rw_content_t /var/www/html/suma/log
chcon -t httpd_sys_rw_content_t /var/www/html/suma/log/sumaserver.log
```

The command sets the “security context” of the files to designate them as files that Apache is allowed to read and write. That should persuade SELinux that yes, it really is OK for Suma to write its own log file.

(Thanks to Will Martin of the University of North Dakota.)

## GitHub Issues

[Closed Suma issues](https://github.com/suma-project/Suma/issues) on Github may also be a good source of information for troubleshooting your installation.
