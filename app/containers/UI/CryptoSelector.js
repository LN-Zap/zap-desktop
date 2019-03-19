import { connect } from 'react-redux'
import Dropdown from 'components/UI/Dropdown'
import { tickerSelectors, setCurrency } from 'reducers/ticker'

const mapStateToProps = state => ({
  activeKey: state.ticker.currency,
  items: tickerSelectors.currencyFilters(state),
})

const mapDispatchToProps = {
  onChange: setCurrency,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dropdown)
