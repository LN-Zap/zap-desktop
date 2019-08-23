import React from 'react'
import { connect } from 'react-redux'
import { closeModal, modalSelectors } from 'reducers/modal'
import ModalStack from 'components/ModalStack'
import Autopay from 'containers/Autopay'
import Pay from 'containers/Pay'
import Request from 'containers/Request'
import Channels from 'containers/Channels'
import ChannelDetailModal from 'containers/Channels/ChannelDetailModal'
import ChannelCreate from 'containers/Channels/ChannelCreate'
import ReceiveModal from 'containers/Wallet/ReceiveModal'
import ActivityModal from 'containers/Activity/ActivityModal'
import ProfilePage from 'containers/Profile/ProfilePage'

const MODALS = {
  PROFILE: <ProfilePage />,
  AUTOPAY: <Autopay mt={4} width={1} />,
  PAY_FORM: <Pay mx="auto" py={4} width={9 / 16} />,
  REQUEST_FORM: <Request mx="auto" py={4} width={9 / 16} />,
  RECEIVE_MODAL: <ReceiveModal mx="auto" py={4} width={9 / 16} />,
  ACTIVITY_MODAL: <ActivityModal mx="auto" width={9 / 16} />,
  CHANNELS: <Channels width={1} />,
  CHANNEL_CREATE: <ChannelCreate py={4} width={1} />,
  CHANNEL_DETAIL: <ChannelDetailModal mx={4} py={4} type="CHANNEL_DETAIL" width={1} />,
}

const AppModalStack = props => <ModalStack {...props} modalDefinitions={MODALS} />

const mapStateToProps = state => ({
  modals: modalSelectors.getModalState(state),
})

const mapDispatchToProps = {
  closeModal,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppModalStack)
