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
      'lndconnect://testnet1-lnd.zaphq.io:10009?cert=MIICLDCCAdGgAwIBAgIRAKYFvCWmEHf0pLfq2cjcLVowCgYIKoZIzj0EAwIwPjEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEbMBkGA1UEAxMSemFwLXRlc3RuZXQxLWxuZC0wMB4XDTE4MDkwMzA4MzI1OFoXDTE5MTAyOTA4MzI1OFowPjEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEbMBkGA1UEAxMSemFwLXRlc3RuZXQxLWxuZC0wMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEh4X-3IFky-tnbyR7blabLYLLvuK4UXWqsh48_zuy2CaRZ96Ot-oaeMDjYkR4dEzxhAKIFMoBFvgkW0bL_qDRzKOBrzCBrDAOBgNVHQ8BAf8EBAMCAqQwDwYDVR0TAQH_BAUwAwEB_zCBiAYDVR0RBIGAMH6CEnphcC10ZXN0bmV0MS1sbmQtMIIJbG9jYWxob3N0ghV0ZXN0bmV0MS1sbmQuemFwaHEuaW-CBHVuaXiCCnVuaXhwYWNrZXSHBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHBAo0C3mHEP6AAAAAAAAACBSL__7XNwaHBCPEVWswCgYIKoZIzj0EAwIDSQAwRgIhAPfhInyLkbnxYtqa3YTZPnvMWeg9Sp-Pzc_7SHG2TV2jAiEArflwta6DpWRdVm_-dsFiOudmKAYesrhPOy-FqGhv80g&macaroon=AgEDbG5kAooBAwoQkTBPLSccRQ73dfO7yg9kEBIBMBoPCgdhZGRyZXNzEgRyZWFkGgwKBGluZm8SBHJlYWQaEAoIaW52b2ljZXMSBHJlYWQaDwoHbWVzc2FnZRIEcmVhZBoQCghvZmZjaGFpbhIEcmVhZBoPCgdvbmNoYWluEgRyZWFkGg0KBXBlZXJzEgRyZWFkAAAGILvahRTNoJX5j7_JRu_AuDQj6eSOLPQQ6fJ99F_ux6PL',
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
