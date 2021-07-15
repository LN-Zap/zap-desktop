import { waitForReact } from 'testcafe-react-selectors'

import Loading from './pages/loading'
import { getBaseUrl, getPageTitle, assertNoConsoleErrors } from './utils/helpers'

const loadingPage = new Loading()

fixture('App')
  .page(getBaseUrl())
  .beforeEach(async () => {
    await waitForReact()
  })
  .afterEach(assertNoConsoleErrors)

test('should open window and show loading screen', async t => {
  const { loadingBolt } = loadingPage

  await t
    .expect(getPageTitle())
    .eql('Zap')
    .expect(loadingBolt.exists)
    .ok()
})
