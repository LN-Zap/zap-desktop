import { waitForReact } from 'testcafe-react-selectors'

import { isMainnetAutopilot, isNetworkSelectionEnabled } from '../../utils/featureFlag'
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

fixture('Onboarding (create)')
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

test('should create a new wallet', async t => {
  await t
    // Fill out and submit ConnectionType form.
    .expect(onboarding.connectionType.exists)
    .ok()
    .click(onboarding.nextButton)

    // Wait for SeedView to generate seed and then submit the form.
    .expect(onboarding.seedView.withProps({ isFetchingSeed: false }).exists)
    .ok()
    .expect(onboarding.nextButton.hasAttribute('disabled'))
    .notOk('ready to be clicked')
    .click(onboarding.nextButton)
    .expect(onboarding.seedConfirm.exists)
    .ok()

  const seed = await onboarding.seedConfirm.getReact(({ props }) => props.seed)

  const seedWordIndexes = await onboarding.seedConfirm.getReact(
    ({ state }) => state.seedWordIndexes
  )

  const word1 = seed[seedWordIndexes[0] - 1]
  const word2 = seed[seedWordIndexes[1] - 1]
  const word3 = seed[seedWordIndexes[2] - 1]

  const password = 'password'

  // Fill out and submit SeedConfirm form.
  await t
    .typeText(onboarding.seeedWordInput1, word1, { paste: true })
    .typeText(onboarding.seeedWordInput2, word2, { paste: true })
    .typeText(onboarding.seeedWordInput3, word3, { paste: true })
    .click(onboarding.nextButton)

    // Fill out Password form.
    .typeText(onboarding.passwordInput, password, { paste: true })

    // Verify password confirm behavior.
    .typeText(onboarding.passwordConfirmInput, 'incorrect password', { paste: true })
    .click(onboarding.nextButton)
    .expect(onboarding.nextButton.hasAttribute('disabled'))
    .ok()
    .typeText(onboarding.passwordConfirmInput, password, { paste: true, replace: true })
    .expect(onboarding.nextButton.hasAttribute('disabled'))
    .notOk('ready to be submitted')

    // Check if "Show/Hide password" functionality is working
    .click(onboarding.passwordInputSeePasswordButton)

    // We can see the password now
    .expect(onboarding.passwordInput.value)
    .eql(password, 'password equals to what we entered earlier')

    // Input type is text and not password as it was previously
    .expect(onboarding.passwordInput.getAttribute('type'))
    .eql('text')

    // Click on the "Show/Hide password" button again to hide password
    .click(onboarding.passwordInputSeePasswordButton)

    // We can't see the password now
    .expect(onboarding.passwordInput.textContent)
    .notEql(password, 'password is hidden now')

    // Input type is password and not text as it was previously
    .expect(onboarding.passwordInput.getAttribute('type'))
    .eql('password')

    // Continue
    .click(onboarding.nextButton)

    // Fill out and submit Name form.
    .typeText(onboarding.nameInput, 'My Test Wallet', { paste: true })
    .click(onboarding.nextButton)

    // Fill out and submit Network form.
    .expect(!isNetworkSelectionEnabled() || onboarding.network.exists)
    .ok()
    .click(onboarding.nextButton)

    // Fill out and submit Autopilot form.
    .expect(!isMainnetAutopilot() || onboarding.autopilot.exists)
    .ok()
    .click(onboarding.nextButton)

    // Verify that we show the loading bolt and syncing page.
    .expect(loading.loadingBolt.exists)
    .ok()
})
