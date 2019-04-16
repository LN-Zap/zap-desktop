import { waitForReact } from 'testcafe-react-selectors'
import {
  getBaseUrl,
  getUserDataDir,
  assertNoConsoleErrors,
  cleanTestEnvironment,
  cleanElectronEnvironment,
} from './utils/helpers'
import Onboarding from './pages/onboarding'

const onboarding = new Onboarding()

fixture('Onboarding (connect btcpay)')
  .page(getBaseUrl())
  .beforeEach(async t => {
    await waitForReact()
    t.fixtureCtx.userDataDir = await getUserDataDir()
  })
  .afterEach(async t => {
    await assertNoConsoleErrors(t)
    await cleanTestEnvironment({ lnd: false })
  })
  .after(async ctx => {
    await cleanElectronEnvironment(ctx)
  })

test('should connect to an external wallet (btcpay)', async t => {
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
    .typeText(
      onboarding.connectionStringInput,
      `{
    "configurations": [
      {
        "type": "grpc",
        "cryptoCode": "BTC",
        "host": "example.com",
        "port": "19000",
        "macaroon": "macaroon"
      }
    ]
  }`
    )
    .click(onboarding.nextButton)

    // Confirm connection details and submit
    .expect(onboarding.connectionConfirm.exists)
    .ok()
    .click(onboarding.nextButton)
})
