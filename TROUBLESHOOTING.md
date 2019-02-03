# Troubleshooting

If you're encountering some issues when trying to develop, build, or run Zap Desktop, here's a list of resolutions to some of the problems you may be experiencing.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development](#development)

## Installation

[TODO... - please help us add to this list!]

## Configuration

[TODO... - please help us add to this list!]

## Usage

[TODO... - please help us add to this list!]

## Development

#### I'm getting a blank screen running "yarn dev"

You are experiencing blank screen after launching in development mode, and see an error similar to the following in the browser console.

```
Uncaught TypeError: Cannot read property 'state' of undefined
   at unliftState (<anonymous>:2:31678)
   at Object.getState (<anonymous>:2:31745)
   at Object.runComponentSelector [as run] (connectAdvanced.js:37)
   at ProxyComponent.initSelector (connectAdvanced.js:196)
   at ProxyComponent.initSelector (react-hot-loader.development.js:693)
   at new Connect (connectAdvanced.js:134)
   at new Connect(IntlProvider) (eval at ./node_modules/react-hot-loader/dist/react-hot-loader.development.js (http://localhost:1212/dist/main.js:42330:54), <anonymous>:5:7)
   at constructClassInstance (react-dom.development.js:12628)
   at updateClassComponent (react-dom.development.js:14480)
   at beginWork (react-dom.development.js:15335)
```

**Common cause:**

This can be related to outdated Chrome extensions installed in your Electron environment.

**How to resolve:**

Delete your Electron extensions (the latest versions will be reinstalled when you next start the app in development mode).

```
  rm -r ~/Library/Application Support/Electron/extensions
```
