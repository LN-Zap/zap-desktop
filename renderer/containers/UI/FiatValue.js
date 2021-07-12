import React from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Span, Value } from 'components/UI'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  currentTicker: tickerSelectors.currentTicker(state),
  fiatTicker: tickerSelectors.fiatTicker(state),
  currency: 'fiat',
})

const ConnectedValue = connect(mapStateToProps)(Value)

const FiatValue = ({ value, style, ...rest }) => {
  return (
    <Span {...rest}>
      <ConnectedValue style={style} value={value} />
    </Span>
  )
}

FiatValue.propTypes = {
  style: PropTypes.oneOf(['decimal', 'currency']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default FiatValue
