import { Application } from 'spectron'
import electronPath from 'electron'
import path from 'path'

jest.setTimeout(10000)
jest.unmock('electron')

describe('main window', function spec() {
  beforeAll(async () => {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..', '..', 'app')]
    })

    await this.app.start()
    await this.app.client.waitUntilWindowLoaded()
  })

  afterAll(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
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
