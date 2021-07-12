import React from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ModalStack from 'components/ModalStack'
import ActivityModal from 'containers/Activity/ActivityModal'
import Autopay from 'containers/Autopay'
import Channels from 'containers/Channels'
import ChannelCreate from 'containers/Channels/ChannelCreate'
import ChannelDetailModal from 'containers/Channels/ChannelDetailModal'
import Pay from 'containers/Pay'
import ProfilePage from 'containers/Profile/ProfilePage'
import Request from 'containers/Request'
import ReceiveModal from 'containers/Wallet/ReceiveModal'
import { closeModal, modalSelectors } from 'reducers/modal'

const RequestModalContent = ({ isAnimating }) => (
  <Request isAnimating={isAnimating} mx="auto" py={4} width={9 / 16} />
)
RequestModalContent.propTypes = {
  isAnimating: PropTypes.bool,
}

const AutopayModalContent = () => <Autopay mt={4} width={1} />

const PayModalContent = () => <Pay mx="auto" py={4} width={9 / 16} />

const ReceiveModalContent = () => <ReceiveModal mx="auto" py={4} width={9 / 16} />

const ActivityModalContent = () => <ActivityModal mx="auto" py={4} width={9 / 16} />

const ChannelsModelContent = () => <Channels width={1} />

const ChannelCreateModalContent = () => <ChannelCreate py={4} width={1} />

const ChannelDetailModalContent = ({ type }) => (
  <ChannelDetailModal mx={4} py={4} type={type} width={1} />
)
ChannelDetailModalContent.propTypes = {
  type: PropTypes.string,
}

const MODALS = {
  AUTOPAY: { render: AutopayModalContent },
  ACTIVITY_MODAL: { render: ActivityModalContent },
  CHANNELS: { render: ChannelsModelContent },
  CHANNEL_CREATE: { render: ChannelCreateModalContent },
  CHANNEL_DETAIL: { render: ChannelDetailModalContent },
  PAY_FORM: { render: PayModalContent },
  PROFILE: { component: ProfilePage },
  REQUEST_FORM: { render: RequestModalContent },
  RECEIVE_MODAL: { render: ReceiveModalContent },
}

const AppModalStack = props => <ModalStack {...props} modalDefinitions={MODALS} />

const mapStateToProps = state => ({
  modals: modalSelectors.getModalState(state),
})

const mapDispatchToProps = {
  closeModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(AppModalStack)
