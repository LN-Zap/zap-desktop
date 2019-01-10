import { waitForReact } from 'testcafe-react-selectors'
import {
  getBaseUrl,
  assertNoConsoleErrors,
  deleteUserData,
  deleteDatabase,
  killLnd
} from './utils/helpers'
import Onboarding from './pages/onboarding'
import Loading from './pages/loading'

const onboarding = new Onboarding()
const loading = new Loading()

fixture('Onboarding (btcpay)')
  .page(getBaseUrl())
  .beforeEach(async () => {
    await waitForReact()
  })
  .afterEach(async t => {
    await assertNoConsoleErrors(t)
    await killLnd()
    await deleteUserData()
    await deleteDatabase()
  })

test('should connect to a btcpayserver wallet', async t => {
  await t
    // Fill out and submit ConnectionType form.
    .expect(onboarding.connectionType.exists)
    .ok()
    .click(onboarding.connectionTypes.btcpayserver.radio)
    .click(onboarding.nextButton)

    // Fill out and submit ConnectionDetails form.
    .expect(onboarding.btcPayServer.exists)
    .ok()
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

    // Verify that we show the loading bolt
    // TODO: We are testing with invalid connection details since we dont have readyly available access to a
    // BTCPayServer test instance that we can connect with. Ideally, we would set one up, connect to that and verify
    // a successful connection.
    .expect(loading.loadingBolt.exists)
    .ok()
})
