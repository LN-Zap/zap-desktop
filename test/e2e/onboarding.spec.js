import { waitForReact } from 'testcafe-react-selectors'
import { getBaseUrl, assertNoConsoleErrors } from './utils/helpers'
import Onboarding from './pages/onboarding'
import Syncing from './pages/syncing'
import Loading from './pages/loading'

const onboardingPage = new Onboarding()
const syncingPage = new Syncing()
const loadingPage = new Loading()

fixture('Onboarding')
  .page(getBaseUrl())
  .beforeEach(async () => {
    await waitForReact()
  })
  .afterEach(assertNoConsoleErrors)

test('should create a new wallet', async t => {
  const {
    connectionType,
    seedView,
    seedConfirm,
    seeedWordInput1,
    seeedWordInput2,
    seeedWordInput3,
    nextButton,
    passwordInput,
    nameInput,
    autopilot
  } = onboardingPage

  const { syncing } = syncingPage
  const { loadingBolt } = loadingPage

  await t
    // Fill out and submit ConnectionType form.
    .expect(connectionType.exists)
    .ok()
    .click(nextButton)

  // Wait for SeedView to generate seed and then submit the form.
  await t
    .expect(seedView.withProps({ fetchingSeed: false }).exists)
    .ok()
    .click(nextButton)

    // Fill out and submit seedConfirm form.
    .expect(seedConfirm.exists)
    .ok()

  // Select the relevant seed words.
  const seedConfirmState = await seedConfirm.getReact()
  const { seed } = seedConfirmState.props
  const word1 = seed[seedConfirmState.state.seedWordIndexes[0] - 1]
  const word2 = seed[seedConfirmState.state.seedWordIndexes[1] - 1]
  const word3 = seed[seedConfirmState.state.seedWordIndexes[2] - 1]

  // Fill out and submit SeedConfirm form.
  await t
    .typeText(seeedWordInput1, word1)
    .typeText(seeedWordInput2, word2)
    .typeText(seeedWordInput3, word3)
    .click(nextButton)

    // Fill out and submit Password form.
    .typeText(passwordInput, 'password')
    .click(nextButton)

    // Fill out and submit Name form.
    .typeText(nameInput, 'My Test Wallet')
    .click(nextButton)

    // Fill out and submit Autopilot form.
    .expect(autopilot.exists)
    .ok()
    .click(nextButton)

    // Verify that we show the loading bolt and syncing page.
    .expect(loadingBolt.exists)
    .ok()
    .expect(syncing.exists)
    .ok()
})
