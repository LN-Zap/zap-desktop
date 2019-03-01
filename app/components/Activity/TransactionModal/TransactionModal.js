import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import { FormattedDate, FormattedTime, FormattedMessage, FormattedNumber } from 'react-intl'
import { Flex } from 'rebass'
import { blockExplorer } from 'lib/utils'
import { Bar, DataRow, Header, Link, Panel, Span, Text } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import Onchain from 'components/Icon/Onchain'
import Padlock from 'components/Icon/Padlock'
import messages from './messages'

export default class TransactionModal extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    networkInfo: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  }

  showBlock = hash => {
    const { networkInfo } = this.props
    return networkInfo && blockExplorer.showBlock(networkInfo, hash)
  }

  showAddress = address => {
    const { networkInfo } = this.props
    return networkInfo && blockExplorer.showAddress(networkInfo, address)
  }

  showTransaction = hash => {
    const { networkInfo } = this.props
    return networkInfo && blockExplorer.showTransaction(networkInfo, hash)
  }

  render() {
    const { item, ...rest } = this.props
    const destAddress = get(item, 'dest_addresses[0]')
    const amount = item.amount || item.limboAmount || 0
    const isIncoming = item.received || item.limboAmount > 0

    return (
      <Panel {...rest}>
        <Panel.Header>
          <Header
            title={<FormattedMessage {...messages[isIncoming ? 'title_received' : 'title_sent']} />}
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
                <CryptoSelector mr={2} />
                <CryptoValue value={amount} fontSize="xxl" />
              </Flex>
            }
          />

          <Bar />

          <DataRow
            left={<FormattedMessage {...messages.current_value} />}
            right={
              <Flex alignItems="center">
                <FiatSelector mr={2} />
                <FiatValue value={amount} />
              </Flex>
            }
          />

          {item.num_confirmations > 0 && (
            <>
              <Bar />

              <DataRow
                left={<FormattedMessage {...messages.date_confirmed} />}
                right={
                  item.num_confirmations ? (
                    <>
                      <Text>
                        <FormattedDate
                          value={item.time_stamp * 1000}
                          year="numeric"
                          month="long"
                          day="2-digit"
                        />
                      </Text>
                      <Text>
                        <FormattedTime value={item.time_stamp * 1000} />
                      </Text>
                    </>
                  ) : (
                    <FormattedMessage {...messages.unconfirmed} />
                  )
                }
              />

              <Bar />

              <DataRow
                left={<FormattedMessage {...messages.num_confirmations} />}
                right={<FormattedNumber value={item.num_confirmations} />}
              />

              <Bar />

              <DataRow
                left={<FormattedMessage {...messages.address} />}
                right={
                  <Link
                    className="hint--bottom-left"
                    data-hint={destAddress}
                    onClick={() => this.showAddress(destAddress)}
                  >
                    <Truncate text={destAddress} />
                  </Link>
                }
              />
            </>
          )}

          <Bar />

          {!isIncoming && (
            <>
              <DataRow
                left={<FormattedMessage {...messages.fee} />}
                right={
                  <Flex alignItems="center">
                    <FiatSelector mr={2} />
                    <FiatValue value={item.total_fees} />
                  </Flex>
                }
              />

              <Bar />
            </>
          )}

          <DataRow
            left={<FormattedMessage {...messages.status} />}
            right={
              item.block_height ? (
                <>
                  <Link
                    className="hint--bottom-left"
                    data-hint={item.block_hash}
                    onClick={() => this.showBlock(item.block_hash)}
                  >
                    <FormattedMessage
                      {...messages.block_height}
                      values={{ height: item.block_height }}
                    />
                  </Link>

                  {item.maturityHeight && (
                    <Flex mt={1} alignItems="center">
                      <Span color="gray" fontSize="s" mr={1}>
                        <Padlock />
                      </Span>
                      <Text>
                        <FormattedMessage
                          {...messages.maturity_height}
                          values={{ height: item.maturityHeight }}
                        />
                      </Text>
                    </Flex>
                  )}
                </>
              ) : (
                <FormattedMessage {...messages.unconfirmed} />
              )
            }
          />

          <Bar />

          <DataRow
            left={<FormattedMessage {...messages.tx_hash} />}
            right={
              <Link
                className="hint--bottom-left"
                data-hint={item.tx_hash}
                onClick={() => this.showTransaction(item.tx_hash)}
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
