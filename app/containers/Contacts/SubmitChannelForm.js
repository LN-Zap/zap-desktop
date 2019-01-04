import { connect } from 'react-redux'
import { setCurrency, setFiatTicker, tickerSelectors } from 'reducers/ticker'
import { closeContactsForm, closeChannelForm, contactFormSelectors } from 'reducers/contactsform'
import { openChannel } from 'reducers/channels'
import SubmitChannelForm from 'components/Contacts/SubmitChannelForm'

const mapStateToProps = state => ({
  currentTicker: tickerSelectors.currentTicker(state),
  cryptoCurrency: state.ticker.currency,
  cryptoCurrencies: tickerSelectors.currencyFilters(state),
  dupeChanInfo: contactFormSelectors.dupeChanInfo(state),
  fiatCurrencies: state.ticker.fiatTickers,
  fiatCurrency: state.ticker.fiatTicker,
  node: state.contactsform.node
})

const mapDispatchToProps = {
  closeChannelForm: closeChannelForm,
  closeContactsForm: closeContactsForm,
  openChannel: openChannel,
  setCryptoCurrency: setCurrency,
  setFiatCurrency: setFiatTicker
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitChannelForm)
