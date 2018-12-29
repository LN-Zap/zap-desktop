import React from 'react'
import PropTypes from 'prop-types'
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { blockExplorer } from 'lib/utils'
import { Bar, DataRow, Dropdown, Header, Link, Panel, Text, Value } from 'components/UI'
import { Truncate } from 'components/Util'
import Onchain from 'components/Icon/Onchain'
import messages from './messages'

export default class TransactionModal extends React.PureComponent {
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
    /** Network info  */
    network: PropTypes.object.isRequired,

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
      network,
      setCryptoCurrency,
      setFiatCurrency,
      ...rest
    } = this.props

    return (
      <Panel {...rest}>
        <Panel.Header>
          <Header
            title={
              <FormattedMessage {...messages[item.received ? 'title_received' : 'title_sent']} />
            }
            subtitle={<FormattedMessage {...messages.subtitle} />}
            logo={<Onchain height="45px" width="45px" />}
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
                    value={item.amount}
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
                  value={item.amount}
                  currency="fiat"
                  currentTicker={currentTicker}
                  fiatTicker={fiatCurrency}
                />
              </Flex>
            }
          />

          <Bar />

          <DataRow
            left={<FormattedMessage {...messages.date_confirmed} />}
            right={
              <>
                <FormattedDate
                  value={item.time_stamp * 1000}
                  year="numeric"
                  month="long"
                  day="2-digit"
                />
                <br />
                <FormattedTime value={item.time_stamp * 1000} />
              </>
            }
          />

          <Bar />

          <DataRow
            left={<FormattedMessage {...messages.address} />}
            right={
              <Link
                className="hint--bottom-left"
                data-hint={item.dest_addresses[0]}
                onClick={() => blockExplorer.showAddress(network, item.dest_addresses[0])}
              >
                <Truncate text={item.dest_addresses[0]} />
              </Link>
            }
          />

          <Bar />

          {!item.received && (
            <>
              <DataRow
                left={<FormattedMessage {...messages.fee} />}
                right={
                  <Flex alignItems="center">
                    <Dropdown
                      activeKey={fiatCurrency}
                      items={fiatCurrencies}
                      onChange={setFiatCurrency}
                      mr={2}
                    />
                    <Value
                      value={item.total_fees}
                      currency="fiat"
                      currentTicker={currentTicker}
                      fiatTicker={fiatCurrency}
                    />
                  </Flex>
                }
              />

              <Bar />
            </>
          )}

          <DataRow
            left={<FormattedMessage {...messages.block_height} />}
            right={
              <Link
                className="hint--bottom-left"
                data-hint={item.block_hash}
                onClick={() => blockExplorer.showBlock(network, item.block_hash)}
              >
                {item.block_height}
              </Link>
            }
          />

          <Bar />

          <DataRow
            left={<FormattedMessage {...messages.tx_hash} />}
            right={
              <Link
                className="hint--bottom-left"
                data-hint={item.tx_hash}
                onClick={() => blockExplorer.showTransaction(network, item.tx_hash)}
              >
                <Truncate text={item.tx_hash} />
              </Link>
            }
          />
        </Panel.Body>
      </Panel>
    )
  }
}
