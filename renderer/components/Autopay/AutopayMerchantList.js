import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'

import AutopayGrid from './AutopayGrid'
import AutopaySearchNoResults from './AutopaySearchNoResults'

const AutopayList = ({ merchants, openAutopayCreateModal, ...rest }) => {
  if (merchants.length === 0) {
    return <AutopaySearchNoResults {...rest} />
  }

  return (
    <Box as="article" {...rest}>
      <AutopayGrid items={merchants} onClick={openAutopayCreateModal} />
    </Box>
  )
}

AutopayList.propTypes = {
  merchants: PropTypes.array,
  openAutopayCreateModal: PropTypes.func.isRequired,
}

AutopayList.defaultProps = {
  merchants: [],
}

export default AutopayList
