import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { Heading, Text } from 'components/UI'
import Lightning from 'components/Icon/Lightning'
import Onchain from 'components/Icon/Onchain'
import PaperPlane from 'components/Icon/PaperPlane'

/**
 * Header for opayment form.
 */
class PayHeader extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['onchain', 'offchain'])
  }

  render() {
    const { title, type } = this.props
    return (
      <Text textAlign="center">
        <Box mx="auto" css={{ height: '55px' }}>
          {type === 'offchain' && <Lightning height="45px" width="45px" />}
          {type === 'onchain' && <Onchain height="45px" width="45px" />}
          {!type && <PaperPlane height="35px" width="35px" />}
        </Box>
        <Heading.h1 mx="auto">{title}</Heading.h1>
        <Heading.h4 mx="auto">
          &nbsp;
          {type === 'onchain' && 'On-Chain Payment'} {type === 'offchain' && 'Lightning Payment'}
        </Heading.h4>
      </Text>
    )
  }
}

export default PayHeader
