# Advanced Usage

## Table of Contents

- [Compiling Zap From Source](#compiling-zap-from-source)
- [Lightning Network Daemon (lnd)](<#lightning-network-daemon-lnd>)
- [Running Zap](#running-zap)

## Compiling Zap From Source

**_Note:_** _If you have installation or compilation issues, please file a [Github issue][issues] or ping us in [Slack][slack]._

### Prerequisites

To compile the Zap wallet, you will need:

- **[Node.js version >= 8](https://nodejs.org)** and **[npm version >= 5](https://www.npmjs.com)**
- **[yarn](https://yarnpkg.com/lang/en/docs/install/)**

### Downloading Zap

After installing the above prerequisites, clone the repo via git:

```bash
git clone https://github.com/LN-Zap/zap-desktop.git
```

### Installing Dependencies

Install all the dependencies with yarn:

```bash
cd zap-desktop
yarn
```

## Lightning Network Daemon (lnd)

Zap requires `lnd` but does not store `lnd` binaries in the Github repo.

To setup `lnd` for Zap, you have two options:

- [Light Client](#light-client)
- [Full Bitcoin Node](#full-bitcoin-node)

### Light Client

`lnd` allows you to configure your node to use the new light client `neutrino` (BIP 157 & BIP 158) which allows you to run `lnd` without requiring a full node.

This is the default configuration for the Zap wallet. To use the light client you can either use the [Lightning Labs Binary](#lightning-labs-binary) or [Compile lnd](#compile-lnd).

#### Lightning Labs Binary

**_Note:_** _The Lightning Labs `lightning-app` project is different then [lnd](https://github.com/lightningnetwork/lnd)_

Download the [lnd binary](https://github.com/lightningnetwork/lnd/releases) for your appropriate OS and copy it to the [appropriate location](#lnd-location) for your OS.

#### Compile lnd

You can [compile](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md) `lnd` from source to have the latest development version. This allows you to use [`lncli`](http://dev.lightning.community/overview/#lnd-interfaces) in addition to Zap, and run a separate `lnd` instance with [custom](http://dev.lightning.community/guides/installation/#lnd) configuration. Zap will detect the separate `lnd` instance and use it as the backend client.

For Zap to run properly without any custom `lnd` setup, copy the `lnd` binary to the [appropriate location](#lnd-location) for your OS.

The `lnd` binary can be found at `$GOPATH/bin`.

### Full Bitcoin Node

Follow the instructions on the [lnd installation](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md) page.

### lnd Location

Zap expects `lnd` to be in one of these directories depending on your OS:
- macOS `resources/bin/darwin/`
- Linux `resources/bin/linux/`
- Windows `resources/bin/win32/`

On macOS and Linux:
1. make sure the file has execute permissions:
```bash
chmod +x lnd
```
2. symlink instead of copy executable
```bash
cd resources/bin/<operating-system>
sudo ln -s $GOPATH/bin/lnd .
``` 




## Running Zap

### Testing

To test that everything has been installed correctly:

```bash
npm run build
npm run test
```

### Running

To run Zap:

```bash
npm run dev
```

if you are using a custom lnd: 
1. click "custom" in the GUI
2. fill out custom lnd fields: 
    1. host/port is usually localhost:10009 (unless rpclisten=port is not listening on 10009 in .lnd/lnd.conf)
    2. tls cert: ~/.lnd/tls.cert (unless tlscertpath in .lnd/lnd.conf is different)
    3. macaroon file:  ~/.lnd/admin.macroon
3. lncli unlock
tls and macaroon files should generate automatically when running lnd 

### Linting

To check linting:

```bash
npm run lint
```

[issues]: https://github.com/LN-Zap/zap-desktop/issues
[slack]: https://join.slack.com/t/zaphq/shared_invite/enQtMzMxMzIzNDU0NTY3LTgyM2QwYzAyZTA5OTAyMjEwMTQxZmZmZmZkNWUzMTU2MmMyNmMxNjY4Y2VjY2FiYTRkMTkwMTRlMTE4YjM2MWY
