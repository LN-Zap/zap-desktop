const { normalize } = require('path')

module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    getPath: name => normalize(`/tmp/zap-test/${name}`),
    getAppPath: () => normalize('/tmp/zap-test'),
    getLocale: jest.fn()
  },
  remote: {
    app: {
      getLocale: jest.fn()
    }
  },
  dialog: jest.fn(),
  BrowserWindow: jest.fn(),
  ipcMain: {
    on: jest.fn()
  }
}
