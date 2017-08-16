<h1 align="center">
  <img src='http://zap.jackmallers.com/assets/desktop-f9a57ed49fc09119e2c9d3ba7337a5a7b42123b992b2eae14c356fc8a5ea25a3.png' alt="screenshot" />
  <br />
  <center>
    <a href='https://zap.jackmallers.com'>Zap</a>
  </center>
</h1>

Zap is a free Lightning Network wallet focused on user experience and ease of use, with the overall goal of helping the cryptocurrency community scale Bitcoin and other cryptocurrencies.

Zap is built on top of [LND](https://github.com/lightningnetwork/lnd),
uses a [Node.js](https://github.com/LN-Zap/zap-nodejs) proxy and,
[Electron](https://electron.atom.io/) + [React](https://facebook.github.io/react/) + [Redux](https://github.com/reactjs/redux/tree/master/docs) for the UI.

Join us on [slack](https://join.slack.com/t/zaphq/shared_invite/MjI2MTY4NTcwMDUyLTE1MDI2OTA0ODAtNTRjMTY4YTNjNA) to discuss development, design and product

## Install
> For now Zap assumes you are running BTCD, LND and Zap Node.js (will change soon). Please see [installation](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md) for LND and installation for [Zap Node.js](https://github.com/LN-Zap/zap-nodejs) to get that setup first

* **Note: requires a node version >= 7 and an npm version >= 4.**
* **If you have installation or compilation issues, please file a Github issue**

First, clone the repo via git:
```bash
git clone https://github.com/LN-Zap/zap-desktop.git
```

And then install dependencies with yarn

```bash
$ cd zap-desktop
$ yarn
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
Join us on [slack](https://join.slack.com/t/zaphq/shared_invite/MjI2MTY4NTcwMDUyLTE1MDI2OTA0ODAtNTRjMTY4YTNjNA) before tackling a todo to avoid duplicate work. This list will be updated daily to show what todos are being worked on

### Refactor
- [ ] Move Node.js proxy to [ipcRenderer](https://electron.atom.io/docs/api/ipc-renderer/) (roasbeef recommendation)
- [ ] Use two package.json [structure](https://github.com/electron-userland/electron-builder/wiki/Two-package.json-Structure) 
- [ ] General refactor (I know this TODO sucks but the code is a bit sloppy still)

### Features
- [ ] Configurable BTCD + LN node connection (do not assume/rely on localhost)
- [ ] Error handling
- [ ] More tests
- [ ] List on-chain transactions
- [ ] Ability to search filter for payments
- [ ] Websocket handling for transactions
- [ ] Websocket handling for sendpayment
- [ ] Channel notifications
- [ ] Payment notifications
- [ ] Transaction notifications
- [ ] Generate newaddress for the wallet deposit
- [ ] Litecoin UI
- [ ] Settings route
- [ ] describegraph UI to see current status of the Lightning Network
- [ ] Support other currencies (EUR, JPY, etc)

### Design
- [ ] Error handling
- [ ] On-chain transactions list
- [ ] Notifications
- [ ] Litecoin UI (pick out a silver main color)
- [ ] describegraph UI to see current status of the Lightning Network

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

`User wants to view the application in USD`

`User wants to search for a payment request`
