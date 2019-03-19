import { connect } from 'react-redux'
import { Dropdown } from 'components/UI'
import { setFiatTicker } from 'reducers/ticker'

const mapStateToProps = state => ({
  activeKey: state.ticker.fiatTicker,
  items: state.ticker.fiatTickers,
})

const mapDispatchToProps = {
  onChange: setFiatTicker,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dropdown)
