# Configuration

## Table of Contents

- [Overview](#overview)
- [Config files](#config-files)
- [Config options](#config-options)
- [Examples](#examples)

## Overview

Configuration is handled using the [node-config](https://github.com/lorenwest/node-config) package which organizes configuration into hierarchical configurations.

It lets us define a set of default parameters, and extend them for different builds and environments (development, production, etc.).

Configurations are stored in configuration files and can be overridden and extended by environment variables, command line parameters, or via the Zap UI in many cases.

### Config files

Configuration files live in the [`config`](../config) directory. The following files are present:

- **default.js**  
  Defines default config values applied to all environments and builds. Values defined here can be overridden in a more specific config file.

- **development|production|storybook|test.js**  
  Defines config overrides to be applied for specific `NODE_ENV` values.

- **local.js**  
  Defines config overrides applied to all environments and builds. This file is excluded from git so you will need to create the file yourself. _It is recommended to use this file to make temporary changes when developing or testing Zap._

- **custom-environment-variables.json**  
  Defines a mapping between environment variables and config values.

### Config Options

Available config options change from time to time so rather than list them all here we recommended that you inspect the file [`config/default.js`](../config/default.js) in order to learn what configuration options are available.

## Examples

Following are some examples of config overrides that you might find useful when developing Zap or making your own custom build to run.

#### 1. Change the default network to Testnet

Add the following to `config/local.js`:

```js
module.exports = {
  network: 'testnet',
}
```

#### 2. Enable additional controls during the Onboarding process.

Add the following to `config/local.js`:

```js
module.exports = {
  features: {
    networkSelection: true,
    mainnetAutopilot: true,
  },
}
```

#### 3. Enable experimental Static Channel Backup Restore feature.

Add the following to `config/local.js`:

```js
module.exports = {
  features: {
    scbRestore: true,
  },
}
```
