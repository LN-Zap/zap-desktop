import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Button } from 'components/UI'
import ArrowLeft from 'components/Icon/ArrowLeft'
import messages from './messages'

const ChannelBackButton = props => {
  return (
    <Button type="button" variant="secondary" {...props}>
      <Flex>
        <Box>
          <ArrowLeft />
        </Box>
        <Box ml={1}>
          <FormattedMessage {...messages.back_button} />
        </Box>
      </Flex>
    </Button>
  )
}

export default ChannelBackButton
