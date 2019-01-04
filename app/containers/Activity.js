import { connect } from 'react-redux'
import { setCurrency, tickerSelectors } from 'reducers/ticker'
import { fetchBalance } from 'reducers/balance'
import { fetchInvoices, setInvoice, invoiceSelectors } from 'reducers/invoice'
import { fetchPayments, paymentSelectors } from 'reducers/payment'
import { fetchTransactions } from 'reducers/transaction'
import {
  showActivityModal,
  hideActivityModal,
  changeFilter,
  toggleExpiredRequests,
  activitySelectors,
  updateSearchActive,
  updateSearchText
} from 'reducers/activity'
import { walletAddress, openWalletModal } from 'reducers/address'
import { setFormType } from 'reducers/form'

import Activity from 'components/Activity'

const mapDispatchToProps = {
  setCurrency,
  setInvoice,
  fetchPayments,
  fetchInvoices,
  fetchTransactions,
  showActivityModal,
  hideActivityModal,
  changeFilter,
  toggleExpiredRequests,
  walletAddress,
  openWalletModal,
  fetchBalance,
  updateSearchActive,
  updateSearchText,
  setFormType
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
  currencyFilters: tickerSelectors.currencyFilters(state),
  currencyName: tickerSelectors.currencyName(state),
  currentActivity: activitySelectors.currentActivity(state)(state),
  nonActiveFilters: activitySelectors.nonActiveFilters(state),
  showExpiredToggle: activitySelectors.showExpiredToggle(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,

  walletProps: {
    balance: stateProps.balance,
    activeWalletSettings: stateProps.activeWalletSettings,
    address: stateProps.address.address,
    info: stateProps.info,
    ticker: stateProps.ticker,
    currentTicker: stateProps.currentTicker,
    currencyFilters: stateProps.currencyFilters,
    currencyName: stateProps.currencyName,
    network: stateProps.info.network,
    theme: stateProps.currentTheme,
    setCurrency: dispatchProps.setCurrency,
    walletAddress: dispatchProps.walletAddress,
    openReceiveModal: dispatchProps.openWalletModal,
    openPayForm: () => dispatchProps.setFormType('PAY_FORM'),
    openRequestForm: () => dispatchProps.setFormType('REQUEST_FORM')
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Activity)
