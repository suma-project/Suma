Suma 2.0 Upgrade Instructions
=============================

Overview
--------

This document outlines how to upgrade Suma to version 2.0. Upgrading is only necessary if you have previously installed a Suma version less than v2.0. The general Suma installation instructions have been updated to reflect v2.0 and should be referenced as needed.

The most significant addition to v2.0 is the use of [Angular JS](http://angularjs.org) for the analysis and reporting tools. However, **ALL** components of Suma should be updated. If you are already using Suma v1.0 or higher, updating should be a simple process. **If you are updating from a Suma version earlier than v1.0, please refer to the [Version 1.0 Upgrade Docs](UPGRADE_1.0.md) as necessary.**

Upgrade
-------

Depending upon your installation method, either copy the updated Suma files into place or pull the changes from GitHub (preferred).

Notes
------

* Nightly Reports
    Any existing scheduled jobs (cron) for the nightly report will need to be updated to use `YOUR_WEB_DIR/suma/analysis/reports/lib/php/nightlyEmail.php`.