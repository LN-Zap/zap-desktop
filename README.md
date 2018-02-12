<h1 align="center">
  <img src='http://zap.jackmallers.com/assets/desktop-f9a57ed49fc09119e2c9d3ba7337a5a7b42123b992b2eae14c356fc8a5ea25a3.png' alt="screenshot" />
  <br />
  <center>
    <a href='https://zap.jackmallers.com'>Zap</a>
  </center>
</h1>

Zap is a free Lightning Network wallet focused on user experience and ease of use, with the overall goal of helping the cryptocurrency community scale Bitcoin and other cryptocurrencies.

Zap is built on top of [LND](https://github.com/lightningnetwork/lnd), and uses
[Electron](https://electron.atom.io/) + [React](https://facebook.github.io/react/) + [Redux](https://github.com/reactjs/redux/tree/master/docs) for the UI.

Join us on [slack](https://join.slack.com/t/zaphq/shared_invite/enQtMzA4OTgxNTQ4NzUzLTQwYjkzZGM0ZWMwYmYyZTE2Y2E1YjM5NTIwOTU0M2I1Zjc2YWY1NTc4NjdhZWQxNTM1YzEzOGM2YTVlNWIwODc) to discuss development, design and product

## Requirements

* **Node.js version >= 8, npm version >= 5 and [yarn](https://yarnpkg.com/lang/en/docs/install/)**

## Install

**If you have installation or compilation issues, please file a Github issue or ping us in Slack**

After installing the above requirements, clone the repo via git:
```bash
git clone https://github.com/LN-Zap/zap-desktop.git
```

And then install dependencies with yarn + install grpc

```bash
$ cd zap-desktop
$ yarn
$ npm run install-grpc
```
Zap does not store `lnd` binaries in the Github repo so you will need to [download](https://github.com/lightninglabs/lightning-app/tree/master/apps/desktop/bin) the binary file for the appropriate OS from the Lightning Labs wallet repo. Make sure the file has the correct permissions to be executable in Mac/Linux. If you already use the [release](https://github.com/lightninglabs/lightning-app/releases) version, you can copy the binary located at `lightning-app/resources/app/bin/[YOUR-OS-FOLDER]` and place it into `zap-desktop/resources/bin/[YOUR-OS-FOLDER]`.

If you are getting `lnd shutting down 1` error in terminal, try downloading latest `lnd` embedded into [release packages](https://github.com/LN-Zap/zap-desktop/releases).
 Sometimes during development custom builds of `lnd` are used and that can cause problems with launching Zap in development mode.

Alternatively, you can [compile](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md) `lnd` from source to have the latest development version. This allows you to use [`lncli`](http://dev.lightning.community/overview/#lnd-interfaces) in addition to Zap, and run a seperate `lnd` instance with [custom](http://dev.lightning.community/guides/installation/#lnd) configuration. Zap will detect the separate `lnd` instance and use it as the backend client. For Zap to run properly without any custom `lnd` setup, copy the `lnd` binary that will be located in your `$GOPATH/bin` and paste it into Zap as previously mentioned.

Zap expects `lnd` to be in one of these directories depending on your OS:

```
# mac
resources/bin/darwin

#linux
resources/bin/linux

#win32
resources/bin/win32
```

Then to start it:
```bash
$ npm run dev
```

## Test
```bash
$ npm run test
```

## Lint
```bash
$ npm run lint
```

## Contributing:
Please see the [contributing guide](https://github.com/LN-Zap/zap-desktop/blob/master/CONTRIBUTING.md)

## Todos:
Join us on [slack](https://join.slack.com/t/zaphq/shared_invite/enQtMzA4OTgxNTQ4NzUzLTQwYjkzZGM0ZWMwYmYyZTE2Y2E1YjM5NTIwOTU0M2I1Zjc2YWY1NTc4NjdhZWQxNTM1YzEzOGM2YTVlNWIwODc) before tackling a todo to avoid duplicate work. 

The old todo list was recently removed. Come on slack or check open Github issues to see what contributions are needed.

## Q & A (Quality and Assurance)

A good product not only has good software tests but also checks the quality of the UX/UI. Putting ourselves in the shoes of a user will be very important for Zap.

If you see issues please report with screenshots and/or how to reproduce the bug/error

### Devices
- Mac
- Windows
- Linux

### Example user stories
`User wants to connect to a peer`

`User wants to open a channel`

`User wants to create a payment request`

`User wants to make a payment`
