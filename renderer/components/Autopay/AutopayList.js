import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box } from 'rebass'
import { Heading } from 'components/UI'
import AutopayGrid from './AutopayGrid'
import messages from './messages'

const AutopayList = ({ merchants, openAutopayCreateModal, ...rest }) => {
  if (!merchants || !merchants.length) {
    return null
  }
  return (
    <Box as="article" {...rest}>
      <Heading.h1 mb={3} mt={4}>
        <FormattedMessage {...messages.active_list_title} />
      </Heading.h1>
      <AutopayGrid items={merchants} onClick={openAutopayCreateModal} />
    </Box>
  )
}

AutopayList.propTypes = {
  invoiceCurrencyName: PropTypes.string,
  merchants: PropTypes.array,
  openAutopayCreateModal: PropTypes.func.isRequired,
}

AutopayList.defaultProps = {
  merchants: [],
}

export default AutopayList
