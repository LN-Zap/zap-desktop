import React from 'react'
import PropTypes from 'prop-types'
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { blockExplorer } from 'lib/utils'
import { Bar, DataRow, Header, Link, Panel } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import Onchain from 'components/Icon/Onchain'
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
                <CryptoSelector mr={2} />
                <CryptoValue value={item.amount} fontSize="xxl" />
              </Flex>
            }
          />

          <Bar />

          <DataRow
            left={<FormattedMessage {...messages.current_value} />}
            right={
              <Flex alignItems="center">
                <FiatSelector mr={2} />
                <FiatValue value={item.amount} />
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
                onClick={() => this.showAddress(item.dest_addresses[0])}
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
