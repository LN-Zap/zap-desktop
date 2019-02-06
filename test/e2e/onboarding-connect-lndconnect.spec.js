import { waitForReact } from 'testcafe-react-selectors'
import { getBaseUrl, assertNoConsoleErrors, cleanTestEnvironment } from './utils/helpers'
import Onboarding from './pages/onboarding'
import Loading from './pages/loading'

const onboarding = new Onboarding()
const loading = new Loading()

fixture('Onboarding (connect lndconnect)')
  .page(getBaseUrl())
  .beforeEach(async () => {
    await waitForReact()
  })
  .afterEach(async t => {
    await assertNoConsoleErrors(t)
    await cleanTestEnvironment()
  })

test('should connect to an external wallet (lndconnect)', async t => {
  await t
    // Fill out and submit ConnectionType form.
    .expect(onboarding.connectionType.exists)
    .ok()
    .click(onboarding.connectionTypes.custom.radio)
    .click(onboarding.nextButton)

    // Fill out and submit ConnectionDetails form.
    .expect(onboarding.connectionDetails.exists)
    .ok()
    .click(onboarding.connectionDetailsTabs.string.button)
    .typeText(onboarding.connectionStringInput, 'lndconnect://1.2.3.4:10009?cert=aaa&macaroon=bbb')
    .click(onboarding.nextButton)

    // Confirm connection details and submit
    .expect(onboarding.connectionConfirm.exists)
    .ok()
    .click(onboarding.nextButton)

    // Verify that we show the loading bolt and then the wallet page.
    .expect(loading.loadingBolt.exists)
    .ok()
})
