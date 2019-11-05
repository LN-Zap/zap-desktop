import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { showActivityModal, ERROR_DETAILS_DIALOG_ID } from 'reducers/activity'
import { openDialog } from 'reducers/modal'
import Payment from 'components/Activity/Payment'

const showErrorDetailsDialog = openDialog.bind(null, ERROR_DETAILS_DIALOG_ID)
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
