const { normalize } = require('path')

module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    getPath: name => normalize(`/tmp/zap-test/${name}`),
    getAppPath: () => normalize('/tmp/zap-test')
  },
  remote: jest.fn(),
  dialog: jest.fn(),
  BrowserWindow: jest.fn()
}
