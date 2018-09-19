import { Application } from 'spectron'
import electronPath from 'electron'
import path from 'path'

jest.unmock('electron')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

describe('main window', function spec() {
  beforeEach(async () => {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..', '..', 'app')]
    })

    return this.app.start()
  })

  afterEach(() => this.app && this.app.isRunning() && this.app.stop())

  it('should open window', async () => {
    const { client, browserWindow } = this.app

    await client.waitUntilWindowLoaded()
    const title = await browserWindow.getTitle()
    expect(title).toBe('Zap')
  })

  it("should haven't any logs in console of main window", async () => {
    const { client } = this.app

    await client.waitUntilWindowLoaded()
    const logs = await client.getRenderProcessLogs()
    expect(logs).toHaveLength(0)
  })
})
