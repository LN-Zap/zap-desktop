/* eslint-disable no-shadow */
import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { closeAllModals } from 'reducers/modal'
import { decoratedSelectedChannel } from 'reducers/utils'

import ChannelCloseDialog from './ChannelCloseDialog'
import ChannelDetail from './ChannelDetail'

const ChannelDetailModal = ({ channel, type, closeAllModals, ...rest }) => {
  // if selected channel is no longer available, close the modal
  // this is needed to handle external state changes like channel closing
  // initiated either by a 3rd party or a user
  useEffect(() => {
    if (!channel) {
      closeAllModals({ type })
    }
  }, [channel, closeAllModals, type])

  return (
    <>
      <ChannelDetail {...rest} />
      <ChannelCloseDialog />
    </>
  )
}

const mapStateToProps = state => ({
  channel: decoratedSelectedChannel(state),
})

const mapDispatchToProps = {
  closeAllModals,
}

ChannelDetailModal.propTypes = {
  channel: PropTypes.object,
  closeAllModals: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelDetailModal)
