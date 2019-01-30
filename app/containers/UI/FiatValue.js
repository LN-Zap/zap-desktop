import React from 'react'
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

export default FiatValue
