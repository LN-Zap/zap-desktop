import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { Text } from 'components/UI'

import messages from './messages'

const ChannelCount = ({ count, totalCount, ...rest }) => {
  return (
    <Flex alignItems="center" as="section" {...rest}>
      <Text fontWeight="normal" mr={2}>
        <FormattedMessage {...messages.channels} values={{ count, totalCount }} />
      </Text>
    </Flex>
  )
}

ChannelCount.propTypes = {
  count: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
}

export default ChannelCount
