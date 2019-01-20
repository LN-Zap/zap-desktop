import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { StatusIndicator, Text } from 'components/UI'
import { BrowseChannelButton } from '.'

const ChannelItem = ({ statusTooltip, status, name, isSelected, onBrowseClick }) => (
  <Flex as="header" alignItems="center" py={2} my={1} mx={3} css={{ cursor: 'pointer' }}>
    <Box mr={2} className="hint--right" data-hint={statusTooltip}>
      <StatusIndicator variant={status} />
    </Box>
    <Text css={{ '&:hover': { opacity: 0.5 } }}>{name}</Text>
    {isSelected && <BrowseChannelButton onClick={onBrowseClick} />}
  </Flex>
)

ChannelItem.propTypes = {
  statusTooltip: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onBrowseClick: PropTypes.func.isRequired
}

export default ChannelItem
