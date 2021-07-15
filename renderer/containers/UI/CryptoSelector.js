import { connect } from 'react-redux'

import Dropdown from 'components/UI/Dropdown'
import { tickerSelectors, setCryptoUnit } from 'reducers/ticker'

const mapStateToProps = state => ({
  activeKey: tickerSelectors.cryptoUnit(state),
  items: tickerSelectors.cryptoUnits(state),
  valueField: 'name',
})

const mapDispatchToProps = {
  onChange: setCryptoUnit,
}

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown)
