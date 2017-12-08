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

Join us on [slack](https://join.slack.com/t/zaphq/shared_invite/enQtMjc5Njg3NjU5MzMzLWE1M2RiNjYxNWEyMTRjMzhmZDIyNTQ0YTRjNDg4MWNiMzI1ODNlODhhMzE5ZWVmMGVkOWVkMTVmNzBhNDhiZjQ) to discuss development, design and product

## Requirements

* **Node.js version >= 7 and npm version >= 4.**

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
Zap does not store `lnd` binaries in the Github repo so you will now need to go [install lnd](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md). You can then copy the `lnd` binary that will be located in your `$GOPATH/bin` and paste it into Zap. Zap expectes `lnd` to be in one of these directories depending on your OS:

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

## Todos (Last updated August 16th):
Join us on [slack](https://join.slack.com/t/zaphq/shared_invite/enQtMjYzNDQyMTQxOTU4LTY3ZDk4M2Y3YmEzOTM1ODk1NjEwYjJmMmY3NmU2YTM3ZmJmOTViODcxN2E3MmYyNjAxOGNmNzY1ZDhhYmEwMDI) before tackling a todo to avoid duplicate work. 

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
