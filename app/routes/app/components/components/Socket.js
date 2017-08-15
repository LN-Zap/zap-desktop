import React from 'react'
import PropTypes from 'prop-types'
import Websocket from 'react-websocket'

const Socket = ({ fetchChannels }) => {
  const onMessage = () => {
    // TODO: Assumes only socket relationship is with channels. Actually flesh out socket logic
    fetchChannels()
  }

  return (
    <Websocket debug url='ws://localhost:3000/' onMessage={onMessage} />
  )
}

Socket.propTypes = {
  fetchChannels: PropTypes.func.isRequired
}

export default Socket
