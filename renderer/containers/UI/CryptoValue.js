import React from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Span from 'components/UI/Span'
import Value from 'components/UI/Value'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  currency: tickerSelectors.cryptoUnit(state),
})

const ConnectedValue = connect(mapStateToProps)(Value)

const CryptoValue = ({ value, ...rest }) => {
  return (
    <Span {...rest}>
      <ConnectedValue value={value} />
    </Span>
  )
}

CryptoValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default CryptoValue
