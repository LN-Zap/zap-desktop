import { waitForReact } from 'testcafe-react-selectors'

import Loading from './pages/loading'
import Onboarding from './pages/onboarding'
import {
  getBaseUrl,
  getUserDataDir,
  assertNoConsoleErrors,
  cleanTestEnvironment,
  cleanElectronEnvironment,
} from './utils/helpers'

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
      'lndconnect://testnet4-lnd.zaphq.io:10009?cert=MIICYTCCAgagAwIBAgIRAJMTFnc73j4iP6VAU_-nSOowCgYIKoZIzj0EAwIwPjEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEbMBkGA1UEAxMSemFwLXRlc3RuZXQ0LWxuZC0wMB4XDTE5MTAyMzEwMDIyNloXDTIwMTIxNzEwMDIyNlowPjEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEbMBkGA1UEAxMSemFwLXRlc3RuZXQ0LWxuZC0wMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEESndkptIDcgVAdH7ulBVDPZNsKWgD12WJhII2VmbUN9IU1ZFFcv43kg_DyzCH0_158tDGqHp-Npyf9JEQ--y4aOB5DCB4TAOBgNVHQ8BAf8EBAMCAqQwDwYDVR0TAQH_BAUwAwEB_zCBvQYDVR0RBIG1MIGyghJ6YXAtdGVzdG5ldDQtbG5kLTCCCWxvY2FsaG9zdIIVdGVzdG5ldDQtbG5kLnphcGhxLmlvgj56YXBuMzRxZmVlZHcybDV5MjZwM2hubmt1c3FuYmh4Y3h3NjRscTVjb2ptdnE0NXl3NGJjM3NxZC5vbmlvboIEdW5peIIKdW5peHBhY2tldIcEfwAAAYcQAAAAAAAAAAAAAAAAAAAAAYcECjQEPocEIklopocECjf8YDAKBggqhkjOPQQDAgNJADBGAiEAiBiCFmgYrgQyF_OKoZb_I47xnaZYTkdUNeajomMoFKoCIQC6X3YEAMV2r1rbNs0faOUYS3hCTmFK75coXBJHHWFsFw&macaroon=AgEDbG5kAooBAwoQGE3tbiKnewTcFZ2PksnBLxIBMBoPCgdhZGRyZXNzEgRyZWFkGgwKBGluZm8SBHJlYWQaEAoIaW52b2ljZXMSBHJlYWQaDwoHbWVzc2FnZRIEcmVhZBoQCghvZmZjaGFpbhIEcmVhZBoPCgdvbmNoYWluEgRyZWFkGg0KBXBlZXJzEgRyZWFkAAAGILUucIJstjca7--eeHDbtkIQ1BLlYOEXKgxLWQDiuReD',
      { paste: true }
    )

    // Fill out wallet name and submit.
    .expect(onboarding.nameInput.exists)
    .ok()
    .typeText(onboarding.nameInput, 'External Wallet (lndconnect)', { paste: true })
    .click(onboarding.nextButton)

    // Confirm connection details and submit
    .expect(onboarding.connectionConfirm.exists)
    .ok()
    .click(onboarding.nextButton)

    // Verify that we show the loading bolt and then the wallet page.
    .expect(loading.loadingBolt.exists)
    .ok()
})
