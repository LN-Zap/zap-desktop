import { waitForReact } from 'testcafe-react-selectors'
import { getBaseUrl, getPageTitle, assertNoConsoleErrors } from './utils/helpers'
import Loading from './pages/loading'

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
