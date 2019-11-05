import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { ERROR_DETAILS_DIALOG_ID, showActivityModal } from 'reducers/activity'
import { openDialog } from 'reducers/modal'
import Invoice from 'components/Activity/Invoice'

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
)(Invoice)
