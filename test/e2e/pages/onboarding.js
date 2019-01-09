import { ReactSelector } from 'testcafe-react-selectors'

class Onboarding {
  // Controls
  backButton = ReactSelector('BackButton')
  nextButton = ReactSelector('NextButton')

  // Steps
  connectionType = ReactSelector('ConnectionType')
  seedView = ReactSelector('SeedView')
  seedConfirm = ReactSelector('SeedConfirm')
  password = ReactSelector('Password')
  autopilot = ReactSelector('Autopilot')

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
