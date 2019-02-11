import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { Span, Value } from 'components/UI'

const mapStateToProps = state => ({
  currentTicker: tickerSelectors.currentTicker(state),
  fiatTicker: state.ticker.fiatTicker,
  currency: 'fiat'
})

const ConnectedValue = connect(mapStateToProps)(Value)

const FiatValue = ({ value, style, ...rest }) => {
  return (
    <Span {...rest}>
      <ConnectedValue value={value} style={style} />
    </Span>
  )
}

FiatValue.propTypes = {
  style: PropTypes.oneOf(['decimal', 'currency']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default FiatValue
