import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { showActivityModal, setErorDialogDetails, ERROR_DETAILS_DIALOG_ID } from 'reducers/activity'
import { openDialog } from 'reducers/modal'
import Transaction from 'components/Activity/Transaction'

const mapDispatchToProps = dispatch => ({
  showActivityModal(...args) {
    dispatch(showActivityModal(...args))
  },
  showErrorDetailsDialog(details) {
    dispatch(setErorDialogDetails(details))
    dispatch(openDialog(ERROR_DETAILS_DIALOG_ID))
  },
})

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
