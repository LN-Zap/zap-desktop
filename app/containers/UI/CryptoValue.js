import React from 'react'
import { connect } from 'react-redux'
import { Span, Value } from 'components/UI'

const mapStateToProps = state => ({
  currency: state.ticker.currency
})

const ConnectedValue = connect(mapStateToProps)(Value)

const CryptoValue = ({ value, ...rest }) => {
  return (
    <Span {...rest}>
      <ConnectedValue value={value} />
    </Span>
  )
}

export default CryptoValue
