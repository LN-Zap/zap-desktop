import { ReactSelector } from 'testcafe-react-selectors'

class Wallet {
  wallet = ReactSelector('Wallet')
  payButton = ReactSelector('WalletButtons Button').withText('Pay')
  requestButton = ReactSelector('WalletButtons Button').withText('Request')
  identityButton = ReactSelector('WalletBalance Button')
  payForm = new Modal('PAY_FORM')
  rayReqTextArea = this.payForm.modal.findReact('textarea')
  receiveForm = new Modal('RECEIVE_MODAL')
  channelsForm = new Modal('CHANNELS')
  createChannels = new Modal('CHANNEL_CREATE')
  preferences = new Modal('SETTINGS')
  activityModal = new Modal('ACTIVITY_MODAL')
  requestModal = new Modal('REQUEST_FORM')
  mainMenu = ReactSelector('ChannelsMenu')
  settingsMenu = ReactSelector('SettingsMenu')
  txHistoryItem = ReactSelector('Transaction')
    .nth(0)
    .child(0)
  preferencesMenuItem = this.settingsMenu.findReact('DropmenuItem').withProps({ id: 'settings' })
  manageChannels = this.mainMenu.findReact('DropmenuItem').withProps({ id: 'manage' })
  createChannel = this.mainMenu.findReact('DropmenuItem').withProps({ id: 'create' })
}

/**
 * Creates modal selector of the specified `type`
 *
 * @param {string} type
 * @returns
 */
function Modal(type) {
  this.modal = ReactSelector('ModalContent').withProps({ type })
  this.closeButton = this.modal.findReact('CloseButton')
}

export default Wallet
