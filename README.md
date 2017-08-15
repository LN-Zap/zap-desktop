[Zap](https://zap.jackmallers.com)
==================================

<img src="http://zap.jackmallers.com/assets/desktop-f9a57ed49fc09119e2c9d3ba7337a5a7b42123b992b2eae14c356fc8a5ea25a3.png" />

Zap is a free Lightning Network wallet focused on user experience and ease of use, with the overall goal of helping the cryptocurrency community scale Bitcoin and other cryptocurrencies.

## Install

* **Note: requires a node version >= 7 and an npm version >= 4.**
* **If you have installation or compilation issues, please see file a Github issue**

First, clone the repo via git:
```bash
git clone https://github.com/LN-Zap/zap-desktop.git
```

And then install dependencies with yarn and npm.

```bash
$ cd zap-desktop
$ yarn && npm install
```
```bash
$ cd zap-desktop/app
$ yarn && npm install
```

## Current Todo List (Last updated August 15th)

## Refactor
- [ ] Move Node.js proxy to [ipcRenderer](https://electron.atom.io/docs/api/ipc-renderer/) (roasbeef recommendation)
- [ ] Payments modal using selector
- [ ] Invoices modal using selector
- [ ] General refactor (I know this TODO sucks but the code is a bit sloppy still, still need to spend time refactoring)

## Features
- [ ] Configurable BTCD + LN node connection (do not assume/rely on localhost)
- [ ] Error handling
- [ ] List on-chain transactions
- [ ] Websocket handling for transactions
- [ ] Websocket handling for sendpayment
- [ ] Channel notifications
- [ ] Payment notifications
- [ ] Transaction notifications
- [ ] Generate newaddress for the wallet deposit
- [ ] Litecoin UI
- [ ] Settings route
- [ ] describegraph UI to see current status of the Lightning Network

## Design
- [ ] Error handling
- [ ] On-chain transactions list
- [ ] Notifications
- [ ] Litecoin UI (pick out a silver main color)
- [ ] describegraph UI to see current status of the Lightning Network
