import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import styled from 'styled-components'
import { opacity, height } from 'styled-system'
import { Box as BaseBox, Flex as BaseFlex } from 'rebass'
import { Bar, Heading, Text } from 'components/UI'
import withEllipsis from 'components/withEllipsis'
import ChannelStatus from './ChannelStatus'

const ClippedHeading = withEllipsis(Heading.h1)
const ClippedText = withEllipsis(Text)
const Box = styled(BaseBox)(opacity)
const Flex = styled(BaseFlex)(opacity, height)

const ChannelHeader = ({ intl, channel, ...rest }) => {
  const { display_name, display_pubkey, display_status } = channel
  return (
    <Box {...rest}>
      <Flex justifyContent="space-between">
        <ClippedHeading my={1}>{display_name}</ClippedHeading>
        <ChannelStatus status={display_status} mb="auto" />
      </Flex>
      <ClippedText>{display_pubkey}</ClippedText>
      <Box>
        <Bar my={3} />
      </Box>
    </Box>
  )
}

ChannelHeader.propTypes = {
  intl: intlShape.isRequired,
  channel: PropTypes.object.isRequired
}

export default injectIntl(ChannelHeader)
