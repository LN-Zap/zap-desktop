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

Join us on [slack](https://join.slack.com/t/zaphq/shared_invite/enQtMjQ2NTg3NzA5NTkwLTRjNjNhMDc5ZmIyNTA4ZTJiNDNiYzlkM2E5NzhlOTU5ZTI5ZGIxYzQ4NWI5NTcyYjQxZDEzNTQwNmJkNzQ1NmE) to discuss development, design and product

## Requirements

* **An up and running LND** - see [install.md](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md)
* **Node.js version >= 7 and npm version >= 4.**

*For now Zap assumes you are running LND on your own*

## Install

**If you have installation or compilation issues, please file a Github issue or ping us in Slack**

After installing the above requirements, clone the repo via git:
```bash
git clone https://github.com/LN-Zap/zap-desktop.git
```

After the repo is cloned, you'll want to generate a Node.js compatible cert
```bash
# For Linux
$ cd ~/.lnd
# For Mac
$ cd ~/Library/Application\ Support/Lnd
# For Windows
$ cd \Users\{your_user_name}\AppData\Local\Lnd

# Then generate the cert
$ openssl ecparam -genkey -name prime256v1 -out tls.key
$ openssl req -new -sha256 -key tls.key -out csr.csr -subj '/CN=localhost/O=lnd'
$ openssl req -x509 -sha256 -days 3650 -key tls.key -in csr.csr -out tls.cert
$ rm csr.csr
```

And then install dependencies with yarn

```bash
$ cd zap-desktop
$ yarn

# For Mac & Linux
$ ./node_modules/.bin/electron-rebuild

# For Windows
$ .\node_modules\.bin\electron-rebuild.cmd
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
Join us on [slack](https://join.slack.com/t/zaphq/shared_invite/enQtMjQ2NTg3NzA5NTkwLTRjNjNhMDc5ZmIyNTA4ZTJiNDNiYzlkM2E5NzhlOTU5ZTI5ZGIxYzQ4NWI5NTcyYjQxZDEzNTQwNmJkNzQ1NmE) before tackling a todo to avoid duplicate work. 

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

`User wants to view the application in USD`

`User wants to search for a payment request`
