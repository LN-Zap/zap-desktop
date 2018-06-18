import { connect } from 'react-redux'
import { setCurrency, tickerSelectors } from 'reducers/ticker'
import { fetchBalance } from 'reducers/balance'
import { fetchInvoices, setInvoice, invoiceSelectors } from 'reducers/invoice'
import { setPayment, fetchPayments, paymentSelectors } from 'reducers/payment'
import { fetchTransactions } from 'reducers/transaction'
import {
  showActivityModal,
  hideActivityModal,
  changeFilter,
  toggleFilterPulldown,
  activitySelectors,
  updateSearchActive,
  updateSearchText,
} from 'reducers/activity'
import { newAddress, openWalletModal } from 'reducers/address'
import { setFormType } from 'reducers/form'

import { payFormSelectors } from 'reducers/payform'

import { setWalletCurrencyFilters } from 'reducers/info'

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
  updateSearchActive,
  updateSearchText,
  setFormType,
  setWalletCurrencyFilters,
}

const mapStateToProps = state => ({
  activity: state.activity,

  balance: state.balance,
  address: state.address,
  info: state.info,

  payment: state.payment,
  transaction: state.transaction,

  invoice: state.invoice,
  invoices: invoiceSelectors.invoices(state),

  ticker: state.ticker,

  network: state.network,

  paymentModalOpen: paymentSelectors.paymentModalOpen(state),
  invoiceModalOpen: invoiceSelectors.invoiceModalOpen(state),

  currentTicker: tickerSelectors.currentTicker(state),
  currentCurrencyFilters: tickerSelectors.currentCurrencyFilters(state),

  currencyName: tickerSelectors.currencyName(state),

  currentActivity: activitySelectors.currentActivity(state)(state),
  nonActiveFilters: activitySelectors.nonActiveFilters(state),

  showPayLoadingScreen: payFormSelectors.showPayLoadingScreen(state),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,

  walletProps: {
    balance: stateProps.balance,
    address: stateProps.address.address,
    info: stateProps.info,
    ticker: stateProps.ticker,
    currentTicker: stateProps.currentTicker,
    showPayLoadingScreen: stateProps.showPayLoadingScreen,
    showSuccessPayScreen: stateProps.payment.showSuccessPayScreen,
    successTransactionScreen: stateProps.transaction.successTransactionScreen,
    currentCurrencyFilters: stateProps.currentCurrencyFilters,
    currencyName: stateProps.currencyName,
    network: stateProps.info.network,

    setCurrency: dispatchProps.setCurrency,
    setWalletCurrencyFilters: dispatchProps.setWalletCurrencyFilters,
    newAddress: dispatchProps.newAddress,
    openReceiveModal: dispatchProps.openWalletModal,
    openPayForm: () => dispatchProps.setFormType('PAY_FORM'),
    openRequestForm: () => dispatchProps.setFormType('REQUEST_FORM'),
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Activity)
