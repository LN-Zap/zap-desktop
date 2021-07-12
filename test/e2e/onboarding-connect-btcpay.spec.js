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

fixture('Onboarding (connect btcpay)')
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
      /* eslint-disable max-len */
      `{
    "configurations": [
      {
        "type": "grpc",
        "cryptoCode": "BTC",
        "host": "testnet4-lnd.zaphq.io:",
        "port": "10009",
        "macaroon": "AgEDbG5kAooBAwoQGE3tbiKnewTcFZ2PksnBLxIBMBoPCgdhZGRyZXNzEgRyZWFkGgwKBGluZm8SBHJlYWQaEAoIaW52b2ljZXMSBHJlYWQaDwoHbWVzc2FnZRIEcmVhZBoQCghvZmZjaGFpbhIEcmVhZBoPCgdvbmNoYWluEgRyZWFkGg0KBXBlZXJzEgRyZWFkAAAGILUucIJstjca7--eeHDbtkIQ1BLlYOEXKgxLWQDiuReD",
        "cert": "MIICFzCCAb2gAwIBAgIRAPhgI8ebo1CQyvUujsRTqwIwCgYIKoZIzj0EAwIwPjEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEbMBkGA1UEAxMSemFwLXRlc3RuZXQ0LWxuZC0wMB4XDTE5MDcyMjA4MDQ1OFoXDTIwMDkxNTA4MDQ1OFowPjEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEbMBkGA1UEAxMSemFwLXRlc3RuZXQ0LWxuZC0wMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEQahEAuHgLAR0-OhfKgjiPaYFGps9yYvYfDKgSSr_kl918DEWd5JjPQMnupzcbpHG45OwC37LwkyT6cJNA6okEqOBmzCBmDAOBgNVHQ8BAf8EBAMCAqQwDwYDVR0TAQH_BAUwAwEB_zB1BgNVHREEbjBsghJ6YXAtdGVzdG5ldDQtbG5kLTCCCWxvY2FsaG9zdIIVdGVzdG5ldDQtbG5kLnphcGhxLmlvggR1bml4ggp1bml4cGFja2V0hwR_AAABhxAAAAAAAAAAAAAAAAAAAAABhwQKNAAWhwQiSWimMAoGCCqGSM49BAMCA0gAMEUCIQDbAz3VH6CcgFJQEZAzC-fbyBgXchgdxy6lzpgqclqpLAIgcnDgaxUFdr4UYSqgvSNiLKEeQsPk4ofir_RW-38E-uc"
      }
    ]
  }`,
      { paste: true }
    )
    // Fill out wallet name and submit.
    .expect(onboarding.nameInput.exists)
    .ok()
    .typeText(onboarding.nameInput, 'External Wallet (lndconnect)', { paste: true })
    .click(onboarding.nextButton)

    // Confirm connection details and submit.
    .expect(onboarding.connectionConfirm.exists)
    .ok()
    .click(onboarding.nextButton)

    // Verify that we show the loading bolt and then the wallet page.
    .expect(loading.loadingBolt.exists)
    .ok()
})
