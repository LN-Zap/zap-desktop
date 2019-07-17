import { waitForReact } from 'testcafe-react-selectors'
import {
  getBaseUrl,
  getUserDataDir,
  assertNoConsoleErrors,
  cleanTestEnvironment,
  cleanElectronEnvironment,
} from './utils/helpers'
import Onboarding from './pages/onboarding'
import Loading from './pages/loading'

const onboarding = new Onboarding()
const loading = new Loading()

fixture('Onboarding (connect lndconnect)')
  .page(getBaseUrl())
  .beforeEach(async t => {
    await waitForReact()
    t.fixtureCtx.userDataDir = await getUserDataDir()
  })
  .afterEach(async t => {
    await assertNoConsoleErrors(t)
    await cleanTestEnvironment()
  })
  .after(async ctx => {
    await cleanElectronEnvironment(ctx)
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
    .typeText(
      onboarding.connectionStringInput,
      'lndconnect://testnet4-lnd.zaphq.io:10009?cert=MIICKzCCAdGgAwIBAgIRAOm-fpPihsU3nrHCtVZr9KkwCgYIKoZIzj0EAwIwPjEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEbMBkGA1UEAxMSemFwLXRlc3RuZXQ0LWxuZC0wMB4XDTE5MDIyNDEzMjg0OVoXDTIwMDQyMDEzMjg0OVowPjEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEbMBkGA1UEAxMSemFwLXRlc3RuZXQ0LWxuZC0wMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEd_SJQNZoRDFw-P23wgkeTBb2KQvubLmQq5_8Bk5-IM2UyZbkTimg4QprqqRLH59vf7vQTAj3yuzrsRKpcj9b9qOBrzCBrDAOBgNVHQ8BAf8EBAMCAqQwDwYDVR0TAQH_BAUwAwEB_zCBiAYDVR0RBIGAMH6CEnphcC10ZXN0bmV0NC1sbmQtMIIJbG9jYWxob3N0ghV0ZXN0bmV0NC1sbmQuemFwaHEuaW-CBHVuaXiCCnVuaXhwYWNrZXSHBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHBAo0C72HEP6AAAAAAAAACHWo__6hZq-HBCJJaKYwCgYIKoZIzj0EAwIDSAAwRQIhAN56RnvYlxn_ewArTg6pRC7CXoesCYvslmn1SCHRHEzKAiAQb511PdVCq3DMlDoxbxUP0u4DOSjQHhIBEV-kx7P2HQ&macaroon=AgEDbG5kAooBAwoQFKYksu0o_2ajpVACCHFPQxIBMBoPCgdhZGRyZXNzEgRyZWFkGgwKBGluZm8SBHJlYWQaEAoIaW52b2ljZXMSBHJlYWQaDwoHbWVzc2FnZRIEcmVhZBoQCghvZmZjaGFpbhIEcmVhZBoPCgdvbmNoYWluEgRyZWFkGg0KBXBlZXJzEgRyZWFkAAAGIMnTUZzHqQ6pqFCf7ut2E8G8aFbRDlrtaBYuFa6zFfNL',
      { paste: true }
    )
    .click(onboarding.nextButton)

    // Confirm connection details and submit
    .expect(onboarding.connectionConfirm.exists)
    .ok()
    .click(onboarding.nextButton)

    // Verify that we show the loading bolt and then the wallet page.
    .expect(loading.loadingBolt.exists)
    .ok()
})
