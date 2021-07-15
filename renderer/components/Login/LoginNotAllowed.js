import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box } from 'rebass/styled-components'

import Delete from 'components/Icon/Delete'
import { Heading, Text, Card, CenteredContent } from 'components/UI'

import messages from './messages'

const LoginNotAllowed = ({ platform = window.Zap.getPlatform() }) => {
  const descMsg = messages[`error_desc_${platform}`] || messages.error_desc_linux
  return (
    <CenteredContent>
      <Card px={7} py={7} width={640}>
        <Flex alignItems="center" flexDirection="column" mb={4}>
          <Box color="superRed" mb={2}>
            <Delete height={72} width={72} />
          </Box>
          <Heading.H1>
            <FormattedMessage {...messages.header} />
          </Heading.H1>
          <Text color="gray" mt={3} textAlign="left">
            <FormattedMessage {...descMsg} />
          </Text>
        </Flex>
      </Card>
    </CenteredContent>
  )
}

LoginNotAllowed.propTypes = {
  platform: PropTypes.string,
}

export default LoginNotAllowed
