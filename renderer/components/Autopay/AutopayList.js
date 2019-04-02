import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'
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
      <Heading.h1 mb={3} ml={4} mt={4}>
        <FormattedMessage {...messages.active_list_title} />
      </Heading.h1>
      <Flex ref={scroller} css={{ width: '100%', overflowX: 'hidden' }}>
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
