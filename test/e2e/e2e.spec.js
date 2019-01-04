import { Application } from 'spectron'
import electronPath from 'electron'
import path from 'path'

jest.setTimeout(25000)
jest.unmock('electron')

describe('main window', function spec() {
  beforeAll(async () => {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..', '..', 'app')],
      waitTimeout: 10000,
      startTimeout: 10000,
      quitTimeout: 2000,
      requireName: 'electronRequire' // Use requre that we reference in preload.js
    })

    await this.app.start()
    await this.app.client.waitUntilWindowLoaded()
  })

  afterAll(async () => {
    if (this.app && this.app.isRunning()) {
      await this.app.stop()
    }
  })

  it('should open window', async () => {
    const { browserWindow } = this.app

    const title = await browserWindow.getTitle()
    expect(title).toBe('Zap')
  })

  it("should haven't any logs in console of main window", async () => {
    const { client } = this.app

    const logs = await client.getRenderProcessLogs()
    expect(logs).toHaveLength(0)
  })
})
