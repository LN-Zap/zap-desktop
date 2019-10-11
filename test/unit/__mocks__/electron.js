const { normalize } = require('path')
const EventEmitter = require('events')

module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    getPath: name => normalize(`/tmp/zap-test/${name}`),
    getAppPath: () => normalize(`${__dirname}/../../`),
    getLocale: jest.fn(),
  },
  remote: {
    dialog: {
      showOpenDialog: jest.fn(),
    },
    app: {
      getLocale: jest.fn(),
    },
  },
  dialog: jest.fn(),
  BrowserWindow: jest.fn(),
  ipcMain: new EventEmitter(),
}
