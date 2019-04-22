# Debugging

## Table of Contents

- [Logging](#logging)
- [Developer Tools](#chrome-devtools)

## Logging

Zap is able to output detailed logging information whilst the app is running. You can configure the logger by starting the app with one or more of the supported debug related environment variables set.

### Log Levels

Set the `DEBUG_LEVEL` environment variable to specify the enabled log level.

- `trace`: Designates very fine-grained informational events use to follow execution flow at a granular level.
- `debug`: Designates fine-grained informational events that are most useful to debug an application.
- `info`: Designates informational messages that highlight the progress of the application at coarse-grained level.
- `warn`: Designates potentially harmful situations.
- `error`: Designates error events that might still allow the application to continue running.
- `critical`: Designates very severe error events that will presumably lead the application to abort.

```shell
### mac/linux
DEBUG_LEVEL=debug /Applications/Zap.app/Contents/MacOS/Zap

### windows powershell
$env:DEBUG_LEVEL='debug'; C:\Users\USERNAME\AppData\Local\Programs\zap-desktop\Zap.exe
```

_Default setting is `info`_

### Log Namespaces

Set the `DEBUG` environment variable to enable or disable specific log namespaces.

```shell
### mac/linux
DEBUG=zap* /Applications/Zap.app/Contents/MacOS/Zap

### windows powershell
$env:DEBUG='zap*'; C:\Users\USERNAME\AppData\Local\Programs\zap-desktop\Zap.exe
```

_Default setting is `zap:main,zap:lnd,zap:updater`_

## Chrome Devtools

Set the `DEBUG_PROD` environment variable to enable Chrome Developer tools.

```shell
### mac/linux
DEBUG_PROD=1 /Applications/Zap.app/Contents/MacOS/Zap

### windows powershell
$env:DEBUG_PROD='1'; C:\Users\USERNAME\AppData\Local\Programs\zap-desktop\Zap.exe
```
