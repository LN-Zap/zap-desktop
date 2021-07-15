import React, { useRef } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import { Heading } from 'components/UI'
import { useScrollDrag } from 'hooks'

import AutopayCardView from './AutopayCardView'
import messages from './messages'

const CardContainer = styled(Box)`
  user-select: none;
`

const AutopayList = ({ merchants, openAutopayCreateModal, ...rest }) => {
  const [scroller, wrappedOnClick] = useScrollDrag()
  const savedOnClick = useRef()
  savedOnClick.current = wrappedOnClick(openAutopayCreateModal)

  if (!merchants || !merchants.length) {
    return null
  }

  return (
    <Box as="article" {...rest}>
      <Heading.H1 mb={3} ml={4} mt={4}>
        <FormattedMessage {...messages.active_list_title} />
      </Heading.H1>
      <Flex ref={scroller} sx={{ overflowX: 'hidden' }} width={1}>
        {merchants.map((item, index) => {
          return (
            <CardContainer key={item.pubkey} p={2} pl={index ? 2 : 4}>
              <AutopayCardView merchant={item} onClick={savedOnClick.current} />
            </CardContainer>
          )
        })}
      </Flex>
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
