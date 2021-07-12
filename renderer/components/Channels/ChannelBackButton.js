import React from 'react'

import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import ArrowLeft from 'components/Icon/ArrowLeft'
import { Button } from 'components/UI'

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
