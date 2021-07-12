import React from 'react'

import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { Button, Text } from 'components/UI'

import messages from './messages'

const Tutorials = props => (
  <Flex alignItems="center" flexDirection="column" justifyContent="center" {...props}>
    <Text my={3}>
      <FormattedMessage {...messages.tutorials_list_description} />
    </Text>
    <Button mx="auto" onClick={() => window.Zap.openHelpPage()} size="small">
      <FormattedMessage {...messages.tutorials_button_text} />
    </Button>
  </Flex>
)

export default Tutorials
