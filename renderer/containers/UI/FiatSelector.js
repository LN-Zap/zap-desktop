import { connect } from 'react-redux'

import { Dropdown } from 'components/UI'
import { setFiatTicker, tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  activeKey: tickerSelectors.fiatTicker(state),
  items: tickerSelectors.fiatTickers(state),
})

const mapDispatchToProps = {
  onChange: setFiatTicker,
}

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown)
