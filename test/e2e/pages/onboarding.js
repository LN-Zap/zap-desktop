import { ReactSelector } from 'testcafe-react-selectors'

class ConnectionTypeOption {
  constructor(key) {
    this.label = ReactSelector('ConnectionType Radio')
      .find('label')
      .withAttribute('for', key)
    this.radio = this.label.find('input[type=radio]')
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
    Array.from(Array(24).keys()).forEach(async index => {
      this.seedWordInputs.push(new SeedWordAtIndex(index).input)
    })
  }

  // Controls
  backButton = ReactSelector('BackButton')
  nextButton = ReactSelector('NextButton')

  // Steps
  connectionType = ReactSelector('ConnectionType')
  seedView = ReactSelector('SeedView')
  seedConfirm = ReactSelector('SeedConfirm')
  password = ReactSelector('Password')
  autopilot = ReactSelector('Autopilot')

  // Connection type radio options.
  connectionTypes = {
    create: new ConnectionTypeOption('create'),
    import: new ConnectionTypeOption('import')
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
  passwordInput = ReactSelector('Password Input').find('input')
  nameInput = ReactSelector('Name Input').find('input')
}

export default Onboarding
