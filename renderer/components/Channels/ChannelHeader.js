import React from 'react'

import PropTypes from 'prop-types'
import { Box as BaseBox, Flex as BaseFlex } from 'rebass/styled-components'
import styled from 'styled-components'
import { opacity, height } from 'styled-system'

import { Bar, Heading, Text } from 'components/UI'
import { withEllipsis } from 'hocs'

import ChannelStatus from './ChannelStatus'

const ClippedHeading = withEllipsis(Heading.H1)
const ClippedText = withEllipsis(Text)
const Box = styled(BaseBox)(opacity)
const Flex = styled(BaseFlex)(opacity, height)

const ChannelHeader = ({ channel, ...rest }) => {
  const { displayName, displayPubkey, displayStatus } = channel
  return (
    <Box {...rest}>
      <Flex justifyContent="space-between">
        <ClippedHeading my={1}>{displayName}</ClippedHeading>
        <ChannelStatus mb="auto" status={displayStatus} />
      </Flex>
      <ClippedText>{displayPubkey}</ClippedText>
      <Box>
        <Bar my={3} />
      </Box>
    </Box>
  )
}

ChannelHeader.propTypes = {
  channel: PropTypes.object.isRequired,
}

export default ChannelHeader
