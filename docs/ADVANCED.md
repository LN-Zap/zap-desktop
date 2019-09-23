# Advanced Usage

## Table of Contents

- [Compiling Zap From Source](#compiling-zap-from-source)
- [Lightning Network Daemon (lnd)](#lightning-network-daemon-lnd)
- [Running Zap](#running-zap)

## Compiling Zap From Source

**_Note:_** _If you have installation or compilation issues, please file a [Github issue][issues] or ping us in [Slack][slack]._

### Prerequisites

To compile the Zap wallet, you will need:

- **[Node.js version >= 12](https://nodejs.org)** and **[npm version >= 5](https://www.npmjs.com)**
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

### Option 1: default:

Zap installs `lnd` for you as part of the installation process. Zap will automatically start the internal `lnd` daemon for you when you select the `default` connection type during the on-boarding process. In this mode we run `lnd` as a light client called `neutrino` (BIP 157 & BIP 158) which allows us to run `lnd` without requiring a Bitcoin full node on your system - Instead, Zap will connect to one Zap's hosted BTC full nodes.

### Option 2: custom:

To setup your own `lnd` for use with Zap please follow the instructions on the [lnd installation](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md) page. Select the `custom` connection type during the on-boarding process to use your own `lnd` with Zap.

**_Note:_** _Your `lnd` node must already be running and unlocked in order for Zap to connect to it. Ensure that lnd's RPC server is listening on an external interface and that your firewall permits access to it._

## Running Zap

### Testing

To test that everything has been installed correctly:

```bash
yarn test
```

### Running

To run Zap in development mode:

```bash
yarn dev
```

### Linting

To check linting:

```bash
yarn lint
```

### Packaging

To build a production ready version of the app for your target platform:

```bash
yarn package --mac // Build for mac
yarn package --win // Build for windows
yarn package --linux // Build for linux
```

### Debugging

See [DEBUGGING.md](./DEBUGGING.md)

### Configuration

See [CONFIG.md](./CONFIG.md)

[issues]: https://github.com/LN-Zap/zap-desktop/issues
[slack]: https://join.slack.com/t/zaphq/shared_invite/enQtMzMxMzIzNDU0NTY3LTgyM2QwYzAyZTA5OTAyMjEwMTQxZmZmZmZkNWUzMTU2MmMyNmMxNjY4Y2VjY2FiYTRkMTkwMTRlMTE4YjM2MWY
