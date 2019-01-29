import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Bar, Header, Panel } from 'components/UI'
import { RequestSummary } from 'components/Request'
import Lightning from 'components/Icon/Lightning'
import messages from './messages'

export default class InvoiceModal extends React.PureComponent {
  static propTypes = {
    /** Invoice */
    item: PropTypes.object.isRequired,
    /** Current ticker data as provided by blockchain.info */
    currentTicker: PropTypes.object.isRequired,
    /** Currently selected cryptocurrency (key). */
    cryptoCurrency: PropTypes.string.isRequired,
    /** List of supported cryptocurrencies. */
    cryptoCurrencies: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    /** List of supported fiat currencies. */
    fiatCurrencies: PropTypes.array.isRequired,
    /** Currently selected fiat currency (key). */
    fiatCurrency: PropTypes.string.isRequired,

    /** Set the current cryptocurrency. */
    setCryptoCurrency: PropTypes.func.isRequired,
    /** Set the current fiat currency */
    setFiatCurrency: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired
  }

  render() {
    const {
      cryptoCurrency,
      cryptoCurrencies,
      currentTicker,
      fiatCurrency,
      fiatCurrencies,
      item,
      setCryptoCurrency,
      setFiatCurrency,
      showNotification,
      ...rest
    } = this.props

    return (
      <Panel {...rest}>
        <Panel.Header>
          <Header
            title={
              <FormattedMessage
                {...messages[item.settled ? 'title_received' : 'title_requested']}
              />
            }
            subtitle={<FormattedMessage {...messages.subtitle} />}
            logo={<Lightning height="45px" width="45px" />}
          />
          <Bar pt={2} />
        </Panel.Header>

        <Panel.Body>
          <RequestSummary
            cryptoCurrency={cryptoCurrency}
            cryptoCurrencies={cryptoCurrencies}
            currentTicker={currentTicker}
            fiatCurrency={fiatCurrency}
            fiatCurrencies={fiatCurrencies}
            invoice={item}
            payReq={item.payment_request}
            setCryptoCurrency={setCryptoCurrency}
            setFiatCurrency={setFiatCurrency}
            showNotification={showNotification}
          />
        </Panel.Body>
      </Panel>
    )
  }
}
