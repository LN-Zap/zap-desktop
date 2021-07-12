import range from 'lodash/range'
import { waitForReact } from 'testcafe-react-selectors'

import { isNetworkSelectionEnabled, isMainnetAutopilot } from '../../utils/featureFlag'
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

fixture('Onboarding (import)')
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

test('should import a wallet from an existing seed', async t => {
  const seed = [
    'abandon',
    'naive',
    'angry',
    'envelope',
    'execute',
    'great',
    'iron',
    'fee',
    'obtain',
    'allow',
    'path',
    'position',
    'forum',
    'monkey',
    'invite',
    'canal',
    'paper',
    'crouch',
    'pilot',
    'knee',
    'tiger',
    'best',
    'pigeon',
    'believe',
  ]
  const seedPassPhrase = 'lol'
  const password = 'password'

  await t
    // Fill out and submit ConnectionType form.
    .expect(onboarding.connectionType.exists)
    .ok()
    .click(onboarding.connectionTypes.import.radio)
    .click(onboarding.nextButton)

  // Fill in the seed form.
  range(24).forEach(async index => {
    await t.typeText(onboarding.seedWordInputs[index], seed[index]).pressKey('tab')
  })

  // Submit the seed.
  await t
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

    // Input encrypted seed passphrase
    .typeText(onboarding.passPhraseInput, seedPassPhrase, { paste: true })
    .click(onboarding.nextButton)
    .expect(loading.loadingBolt.exists)
    .ok()
})
