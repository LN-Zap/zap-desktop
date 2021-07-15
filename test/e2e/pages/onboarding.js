/* eslint-disable max-classes-per-file */
import range from 'lodash/range'
import { ReactSelector } from 'testcafe-react-selectors'

class ConnectionTypeOption {
  constructor(key) {
    this.radio = ReactSelector('ConnectionType  ConnectionTypeItem').withProps({ value: key })
  }
}

class ConnectionDetailsTab {
  constructor(key) {
    this.button = ReactSelector('ConnectionDetailsTabs Tab')
      .withProps('itemKey', key)
      .findReact('Button')
  }
}

class SeedWordAtIndex {
  constructor(index) {
    this.label = ReactSelector('Recover')
      .find('label')
      .withAttribute('for', `word${index + 1}`)
    this.input = this.label.sibling().find('input')
  }
}

class Onboarding {
  constructor() {
    this.seedWordInputs = []
    range(24).forEach(index => this.seedWordInputs.push(new SeedWordAtIndex(index).input))
  }

  // Controls
  backButton = ReactSelector('BackButton')

  nextButton = ReactSelector('NextButton')

  // Steps
  connectionType = ReactSelector('ConnectionType')

  connectionDetails = ReactSelector('ConnectionDetails')

  connectionConfirm = ReactSelector('ConnectionConfirm')

  seedView = ReactSelector('SeedView')

  seedConfirm = ReactSelector('SeedConfirm')

  password = ReactSelector('Password')

  autopilot = ReactSelector('Autopilot')

  network = ReactSelector('Network')

  // Connection type radio options.
  connectionTypes = {
    create: new ConnectionTypeOption('create'),
    import: new ConnectionTypeOption('import'),
    custom: new ConnectionTypeOption('custom'),
    btcpayserver: new ConnectionTypeOption('btcpayserver'),
  }

  connectionDetailsTabs = {
    string: new ConnectionDetailsTab('FORM_TYPE_CONNECTION_STRING'),
    manual: new ConnectionDetailsTab('FORM_TYPE_MANUAL'),
  }

  // Inputs
  seeedWordInput1 = ReactSelector('SeedConfirm Input')
    .nth(0)
    .find('input')

  seeedWordInput2 = ReactSelector('SeedConfirm Input')
    .nth(1)
    .find('input')

  seeedWordInput3 = ReactSelector('SeedConfirm Input')
    .nth(2)
    .find('input')

  passwordInput = ReactSelector('Password Input')
    .nth(0)
    .find('input')

  passwordConfirmInput = ReactSelector('Password Input')
    .nth(1)
    .find('input')

  passPhraseInput = ReactSelector('WalletRecover PasswordInput').find('input')

  passwordInputSeePasswordButton = ReactSelector('Password Input').find('svg')

  nameInput = ReactSelector('Input')
    .nth(-1)
    .find('input')

  hostInput = ReactSelector('ConnectionDetailsManual Input')
    .nth(0)
    .find('input')

  certInput = ReactSelector('ConnectionDetailsManual Input')
    .nth(1)
    .find('input')

  macaroonInput = ReactSelector('ConnectionDetailsManual Input')
    .nth(2)
    .find('input')

  connectionStringInput = ReactSelector('ConnectionDetails TextArea')
    .withProps({ field: 'connectionString' })
    .find('textarea')
}

export default Onboarding
