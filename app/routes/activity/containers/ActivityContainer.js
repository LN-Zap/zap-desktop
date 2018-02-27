import { connect } from 'react-redux'
import { setCurrency, tickerSelectors } from 'reducers/ticker'
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
import { newAddress, openWalletModal } from 'reducers/address'
import { setFormType } from 'reducers/form'

import { payFormSelectors } from 'reducers/payform'

import Activity from '../components/Activity'

const mapDispatchToProps = {
  setCurrency,
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
  openWalletModal,
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
  nonActiveFilters: activitySelectors.nonActiveFilters(state),

  showPayLoadingScreen: payFormSelectors.showPayLoadingScreen(state),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const walletProps = {
    balance: stateProps.balance,
    address: stateProps.address.address,
    info: stateProps.info,
    ticker: stateProps.ticker,
    currentTicker: stateProps.currentTicker,
    showPayLoadingScreen: stateProps.showPayLoadingScreen,

    setCurrency: dispatchProps.setCurrency,
    newAddress: dispatchProps.newAddress,
    openReceiveModal: dispatchProps.openWalletModal,
    openPayForm: () => dispatchProps.setFormType('PAY_FORM'),
    openRequestForm: () => dispatchProps.setFormType('REQUEST_FORM')
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    walletProps
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Activity)
