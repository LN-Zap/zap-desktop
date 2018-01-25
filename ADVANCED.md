<h1 align='center'>Advanced Usage</h1>

## Compiling Zap From Source

***Note:*** *If you have installation or compilation issues, please file a [Github issue](https://github.com/LN-Zap/zap-desktop/issues) or ping us in [Slack](https://join.slack.com/t/zaphq/shared_invite/enQtMjkyNTAxNDA3MjE2LWE3NGZjZGE5ZmI1NGQ5YTk3MGQzMTdmNDAwYjNhZTJkMWU0ZWZlNzA0MjJiNDBjMzcxYjcyMDMxNWY3OGNhYWQ).*

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

Install all the dependencies with yarn + install grpc:

```bash
cd zap-desktop
yarn
npm run install-grpc
```

## Lightning Network Daemon (lnd)

Zap requires `lnd` but does not store `lnd` binaries in the Github repo.

To setup `lnd` for Zap, you have two options:

- [Light Client](#Light-Client)
- [Full Bitcoin Node](#Full-Bitcoin-Node)

### Light Client

`lnd` has a light client called `neutrino` which allows you to run `lnd` without requiring a full node. This is the default configuration for the Zap wallet. To use the light client you can either use the [Lightning Labs Binary](#Lightning-Labs-Binary) or [Compile lnd](#Compile-lnd).

#### Lightning Labs Binary

***Note:*** *This Lightning Labs `lightning-app` project is different then [lnd](https://github.com/lightningnetwork/lnd)*

Download the [lnd binary](https://github.com/lightninglabs/lightning-app/tree/master/apps/desktop/bin) for your appropriate OS and copy it to the [appropriate location](#lnd-location) for your OS.

#### Compile lnd

You can [compile](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md) `lnd` from source to have the latest development version. This allows you to use [`lncli`](http://dev.lightning.community/overview/#lnd-interfaces) in addition to Zap, and run a seperate `lnd` instance with [custom](http://dev.lightning.community/guides/installation/#lnd) configuration. Zap will detect the separate `lnd` instance and use it as the backend client.

For Zap to run properly without any custom `lnd` setup, copy the `lnd` binary to the [appropriate location](#lnd-location) for your OS.


The `lnd` binary can be found at `$GOPATH/bin`.

### Full Bitcoin Node

Follow the instructions on the [lnd installation](https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md) page.


### lnd Location

Zap expects `lnd` to be in one of these directories depending on your OS:

- macOS `resources/bin/darwin/`
- Linux `resources/bin/linux/`
- Windows `resources/bin/win32/`

On macOS and Linux, make sure the file has execute permissions: 

```bash
chmod +x lnd
```

## Running Zap

### Testing
To test that everything has been installed correctly:

```bash
npm run test
```

### Running

To run Zap:

```bash
npm run dev
```

### Linting
To check linting:

```bash
npm run lint
```
