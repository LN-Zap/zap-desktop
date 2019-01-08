import { startApp, stopApp } from './helpers'

describe('e2e tests', function spec() {
  beforeAll(async () => {
    this.app = await startApp()
  })

  afterAll(async () => {
    await stopApp(this.app)
  })

  it('opens a window', async () => {
    const { client } = this.app

    const windowCount = await client.getWindowCount()
    expect(windowCount).toBeGreaterThanOrEqual(1)
  })

  it('sets the window title as "Zap"', async () => {
    const { browserWindow } = this.app

    const title = await browserWindow.getTitle()
    expect(title).toBe('Zap')
  })

  it("doesn't have any logs in console of main window", async () => {
    const { client } = this.app

    const logs = await client.getRenderProcessLogs()
    expect(logs).toHaveLength(0)
  })
})
