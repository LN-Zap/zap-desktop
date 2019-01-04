import React from 'react'
import PropTypes from 'prop-types'
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Bar, DataRow, Dropdown, Header, Panel, Text, Value } from 'components/UI'
import { Truncate } from 'components/Util'
import Lightning from 'components/Icon/Lightning'
import messages from './messages'

export default class PaymentModal extends React.PureComponent {
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
    setFiatCurrency: PropTypes.func.isRequired
  }

  render() {
    const {
      item,
      cryptoCurrency,
      cryptoCurrencies,
      currentTicker,
      fiatCurrency,
      fiatCurrencies,
      setCryptoCurrency,
      setFiatCurrency,
      ...rest
    } = this.props
    return (
      <Panel {...rest}>
        <Panel.Header>
          <Header
            title={<FormattedMessage {...messages.title_sent} />}
            subtitle={<FormattedMessage {...messages.subtitle} />}
            logo={<Lightning height="45px" width="45px" />}
          />
          <Bar pt={2} />
        </Panel.Header>

        <Panel.Body>
          <DataRow
            left={<FormattedMessage {...messages.amount} />}
            right={
              <Flex alignItems="center">
                <Dropdown
                  activeKey={cryptoCurrency}
                  items={cryptoCurrencies}
                  onChange={setCryptoCurrency}
                  mr={2}
                />
                <Text fontSize="xxl">
                  <Value
                    value={item.value}
                    currency={cryptoCurrency}
                    currentTicker={currentTicker}
                    fiatTicker={fiatCurrency}
                  />
                </Text>
              </Flex>
            }
          />

          <Bar />

          <DataRow
            left={<FormattedMessage {...messages.current_value} />}
            right={
              <Flex alignItems="center">
                <Dropdown
                  activeKey={fiatCurrency}
                  items={fiatCurrencies}
                  onChange={setFiatCurrency}
                  mr={2}
                />
                <Value
                  value={item.value}
                  currency="fiat"
                  currentTicker={currentTicker}
                  fiatTicker={fiatCurrency}
                />
              </Flex>
            }
          />

          <Bar />

          <DataRow
            left={<FormattedMessage {...messages.date_sent} />}
            right={
              <>
                <FormattedDate
                  value={item.creation_date * 1000}
                  year="numeric"
                  month="long"
                  day="2-digit"
                />
                <br />
                <FormattedTime value={item.creation_date * 1000} />
              </>
            }
          />

          <Bar />

          <DataRow
            left={<FormattedMessage {...messages.preimage} />}
            right={
              <Text className="hint--bottom-left" data-hint={item.payment_preimage}>
                <Truncate text={item.payment_preimage} />
              </Text>
            }
          />
        </Panel.Body>
      </Panel>
    )
  }
}
