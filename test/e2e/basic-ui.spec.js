import path from 'path'

import { waitForReact } from 'testcafe-react-selectors'

import Loading from './pages/loading'
import Onboarding from './pages/onboarding'
import Wallet from './pages/wallet'
import {
  getBaseUrl,
  getUserDataDir,
  assertNoConsoleErrors,
  cleanTestEnvironment,
  cleanElectronEnvironment,
} from './utils/helpers'

const onboarding = new Onboarding()
const loading = new Loading()
const wallet = new Wallet()

// eslint-disable-next-line max-len
const payReq = `lntb10n1pw04dvwpp5n5w6ha6hygccxa9aeqzgtpfxacdk8a5f0m35yeyk08gx9g9sfcusdqqcqzpgxq97zvuq57g878u9ckerngw4hmmf3a47ujlfd699g6p98a50s9hdcs3v4pkksqkpqhk4hj2pcaleng7f8u9etpyewxnr54trlje48r90hp29gdgp8eq446`

const address = `tb1qxmjjcuc3d30d3wvgq5l2ezkxa4v95tmn2dspxs`

fixture('Basic wallet UI')
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

test('provide access to basic wallet functionality', async t => {
  await t
    // Fill out and submit ConnectionType form.
    .expect(onboarding.connectionType.exists)
    .ok()
    .click(onboarding.connectionTypes.custom.radio)
    .click(onboarding.nextButton)

    // Fill out and submit ConnectionDetails form.
    .expect(onboarding.connectionDetails.exists)
    .ok()
    .click(onboarding.connectionDetailsTabs.manual.button)
    .typeText(onboarding.hostInput, 'testnet4-lnd.zaphq.io:10009', { paste: true })
    .typeText(onboarding.certInput, path.join(__dirname, 'fixtures', 'tls.cert'), { paste: true })
    .typeText(onboarding.macaroonInput, path.join(__dirname, 'fixtures', 'readonly.macaroon'), {
      paste: true,
    })
    .typeText(onboarding.nameInput, 'My Test Wallet', { paste: true })
    .click(onboarding.nextButton)

    // Confirm connection details and submit
    .expect(onboarding.connectionConfirm.exists)
    .ok()
    .click(onboarding.nextButton)

    // Verify that we show the loading bolt and then the wallet page.
    .expect(loading.loadingBolt.exists)
    .ok()

    // test receive modal
    .click(wallet.identityButton)
    .expect(wallet.receiveForm.modal.exists)
    .ok()
    .click(wallet.receiveForm.closeButton)

    // test request modal
    .click(wallet.requestButton)
    .expect(wallet.requestModal.modal.exists)
    .ok()
    .click(wallet.requestModal.closeButton)

    // test pay form lightning
    .click(wallet.payButton)
    .typeText(wallet.rayReqTextArea, payReq, { paste: true })
    .expect(wallet.payForm.modal.exists)
    .ok()
    .click(wallet.payFormOnChainBackButton())
    .expect(wallet.payForm.modal.exists)
    .ok()
    .click(wallet.payForm.closeButton)

    // test pay form on-chain
    .click(wallet.payButton)
    .typeText(wallet.rayReqTextArea, address, { paste: true })
    .expect(wallet.payForm.modal.exists)
    .ok()
    .typeText(wallet.payFormOnChainAmountInput, `1`, { paste: true })
    .click(wallet.payFormOnChainNextButton)
    .expect(wallet.payForm.modal.exists)
    .ok()
    .click(wallet.payFormOnChainBackButton())
    .expect(wallet.payForm.modal.exists)
    .ok()
    .click(wallet.payFormOnChainBackButton())
    .expect(wallet.payForm.modal.exists)
    .ok()
    .click(wallet.payForm.closeButton)

    // test manage channels
    .click(wallet.ChannelsMenu)
    .click(wallet.manageChannels)
    .expect(wallet.channelsForm.modal.exists)
    .ok()
    .click(wallet.channelsForm.closeButton)

    // test create channel
    .click(wallet.ChannelsMenu)
    .click(wallet.createChannel)
    .expect(wallet.createChannels.modal.exists)
    .ok()
    .click(wallet.createChannels.closeButton)

    // test profile
    .click(wallet.settingsMenu)
    .click(wallet.profileMenuItem)
    .expect(wallet.profile.modal.exists)
    .ok()
    .click(wallet.profile.closeButton)

    // test preferences
    .click(wallet.settingsMenu)
    .click(wallet.preferencesMenuItem)
    .expect(wallet.preferences.modal.exists)
    .ok()
    .click(wallet.preferences.closeButton)

    // test activity modal (sent transaction details)
    .click(wallet.txHistoryItem)
    .expect(wallet.activityModal.modal.exists)
    .ok()
    .click(wallet.activityModal.closeButton)
    .expect(wallet.wallet.exists)
    .ok()
})
