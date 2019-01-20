import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'components/UI'

const ChannelPubkey = ({ pubkey }) => (
  <Text color="gray" fontSize="s" mx={3}>
    {pubkey}
  </Text>
)

ChannelPubkey.propTypes = {
  pubkey: PropTypes.string.isRequired
}

export default ChannelPubkey
