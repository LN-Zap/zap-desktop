import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { showActivityModal, showErrorDetailsDialog } from 'reducers/activity'
import Payment from 'components/Activity/Payment'

const mapDispatchToProps = {
  showActivityModal,
  showErrorDetailsDialog,
}

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Payment)
