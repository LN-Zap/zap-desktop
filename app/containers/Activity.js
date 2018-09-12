import { connect } from 'react-redux'
import { setCurrency, setFiatTicker, tickerSelectors } from 'reducers/ticker'
import { fetchBalance } from 'reducers/balance'
import { fetchInvoices, setInvoice, invoiceSelectors } from 'reducers/invoice'
import { setPayment, fetchPayments, paymentSelectors } from 'reducers/payment'
import { fetchTransactions } from 'reducers/transaction'
import {
  showActivityModal,
  hideActivityModal,
  changeFilter,
  toggleFilterPulldown,
  toggleExpiredRequests,
  activitySelectors,
  updateSearchActive,
  updateSearchText
} from 'reducers/activity'
import { walletAddress, openWalletModal } from 'reducers/address'
import { setFormType } from 'reducers/form'

import { payFormSelectors } from 'reducers/payform'

import { setWalletCurrencyFilters } from 'reducers/info'

import { setSettingsOpen, setActiveSubMenu, disableSubMenu } from 'reducers/settings'

import Activity from 'components/Activity'

const mapDispatchToProps = {
  setCurrency,
  setFiatTicker,
  setPayment,
  setInvoice,
  fetchPayments,
  fetchInvoices,
  fetchTransactions,
  showActivityModal,
  hideActivityModal,
  changeFilter,
  toggleFilterPulldown,
  toggleExpiredRequests,
  walletAddress,
  openWalletModal,
  fetchBalance,
  updateSearchActive,
  updateSearchText,
  setFormType,
  setWalletCurrencyFilters,
  setSettingsOpen,
  setActiveSubMenu,
  disableSubMenu
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

  settings: state.settings,

  paymentModalOpen: paymentSelectors.paymentModalOpen(state),
  invoiceModalOpen: invoiceSelectors.invoiceModalOpen(state),

  currentTicker: tickerSelectors.currentTicker(state),
  currentCurrencyFilters: tickerSelectors.currentCurrencyFilters(state),

  currencyName: tickerSelectors.currencyName(state),

  currentActivity: activitySelectors.currentActivity(state)(state),
  nonActiveFilters: activitySelectors.nonActiveFilters(state),
  showExpiredToggle: activitySelectors.showExpiredToggle(state),

  showPayLoadingScreen: payFormSelectors.showPayLoadingScreen(state)
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
    paymentTimeout: stateProps.payment.paymentTimeout,

    setCurrency: dispatchProps.setCurrency,
    setWalletCurrencyFilters: dispatchProps.setWalletCurrencyFilters,
    walletAddress: dispatchProps.walletAddress,
    openReceiveModal: dispatchProps.openWalletModal,
    openPayForm: () => dispatchProps.setFormType('PAY_FORM'),
    openRequestForm: () => dispatchProps.setFormType('REQUEST_FORM'),

    settingsProps: {
      settings: stateProps.settings,

      toggleSettings: () => {
        if (stateProps.settings.settingsOpen) {
          dispatchProps.setSettingsOpen(false)
        } else {
          dispatchProps.setSettingsOpen(true)
        }

        return
      },
      setActiveSubMenu: dispatchProps.setActiveSubMenu,

      fiatProps: {
        fiatTicker: stateProps.ticker.fiatTicker,
        fiatTickers: stateProps.ticker.fiatTickers,
        disableSubMenu: dispatchProps.disableSubMenu,
        setFiatTicker: dispatchProps.setFiatTicker
      }
    }
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Activity)
