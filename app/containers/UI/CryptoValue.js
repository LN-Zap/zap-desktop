import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Span, Value } from 'components/UI'

const mapStateToProps = state => ({
  currency: state.ticker.currency,
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
