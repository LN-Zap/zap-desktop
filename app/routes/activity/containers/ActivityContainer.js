import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { fetchBalance } from 'reducers/balance'
import {
  fetchInvoices,
  setInvoice,
  invoiceSelectors
} from 'reducers/invoice'
import {
  setPayment,
  fetchPayments,
  paymentSelectors
} from 'reducers/payment'
import { fetchTransactions } from 'reducers/transaction'
import {
  showActivityModal,
  hideActivityModal,
  changeFilter,
  toggleFilterPulldown,
  activitySelectors,
  updateSearchText
} from 'reducers/activity'
import { newAddress } from 'reducers/address'
import { setFormType } from 'reducers/form'

import Activity from '../components/Activity'

const mapDispatchToProps = {
  setPayment,
  setInvoice,
  fetchPayments,
  fetchInvoices,
  fetchTransactions,
  showActivityModal,
  hideActivityModal,
  changeFilter,
  toggleFilterPulldown,
  newAddress,
  fetchBalance,
  updateSearchText,
  setFormType
}

const mapStateToProps = state => ({
  activity: state.activity,

  balance: state.balance,
  address: state.address,
  info: state.info,

  payment: state.payment,

  invoice: state.invoice,
  invoices: invoiceSelectors.invoices(state),

  ticker: state.ticker,

  paymentModalOpen: paymentSelectors.paymentModalOpen(state),
  invoiceModalOpen: invoiceSelectors.invoiceModalOpen(state),

  currentTicker: tickerSelectors.currentTicker(state),

  currentActivity: activitySelectors.currentActivity(state)(state),
  nonActiveFilters: activitySelectors.nonActiveFilters(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,

  // action to open the pay form
  openPayForm: () => dispatchProps.setFormType('PAY_FORM'),
  // action to open the request form
  openRequestForm: () => dispatchProps.setFormType('REQUEST_FORM')
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Activity)
