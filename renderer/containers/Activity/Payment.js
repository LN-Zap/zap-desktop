import { connect } from 'react-redux'

import Payment from 'components/Activity/Payment'
import { showActivityModal, setErorDialogDetails, ERROR_DETAILS_DIALOG_ID } from 'reducers/activity'
import { openDialog } from 'reducers/modal'
import { tickerSelectors } from 'reducers/ticker'

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

export default connect(mapStateToProps, mapDispatchToProps)(Payment)
