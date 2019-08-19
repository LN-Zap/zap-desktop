import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import {
  FormattedDate,
  FormattedTime,
  FormattedMessage,
  FormattedNumber,
  injectIntl,
} from 'react-intl'
import { Flex } from 'rebass'
import { intlShape } from '@zap/i18n'
import blockExplorer from '@zap/utils/blockExplorer'
import { Bar, DataRow, Header, Link, Panel, Span, Text, Button } from 'components/UI'
import { CopyButton, CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import Onchain from 'components/Icon/Onchain'
import Padlock from 'components/Icon/Padlock'
import Download from 'components/Icon/Download'
import messages from './messages'

class TransactionModal extends React.PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    item: PropTypes.object.isRequired,
    networkInfo: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    saveInvoice: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
  }

  saveInvoice = () => {
    const { saveInvoice, item, intl } = this.props
    const destAddress = get(item, 'dest_addresses[0]')
    const amount = item.amount || item.limboAmount || 0
    const isIncoming = item.received || item.limboAmount > 0
    const { tx_hash, time_stamp, num_confirmations } = item
    saveInvoice({
      defaultFilename: tx_hash && `zap-tx-${tx_hash.substring(0, 7)}`,
      title: intl.formatMessage(messages[isIncoming ? 'receipt' : 'outgoing_payment_notification']),
      subtitle: intl.formatMessage(messages.receipt_subtitle),
      invoiceData: [
        num_confirmations
          ? [
              intl.formatMessage({ ...messages.date_confirmed }),
              `${intl.formatDate(time_stamp * 1000)} ${intl.formatTime(time_stamp * 1000)}`,
            ]
          : [
              intl.formatMessage({ ...messages.date_confirmed }),
              intl.formatMessage({ ...messages.unconfirmed }),
            ],
        [intl.formatMessage({ ...messages.address }), destAddress, {}, { fontSize: 10 }],
        tx_hash && [intl.formatMessage({ ...messages.tx_hash }), tx_hash, {}, { fontSize: 10 }],
        [
          intl.formatMessage({ ...messages.amount }),
          `${intl.formatNumber(Math.abs(amount))} satoshis`,
        ],
      ].filter(Boolean),
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
    const { intl, item, showNotification, ...rest } = this.props
    const destAddress = get(item, 'dest_addresses[0]')
    const amount = item.amount || item.limboAmount || 0
    const isIncoming = item.received || item.limboAmount > 0

    return (
      <Panel {...rest}>
        <Panel.Header>
          <Button
            css={`
              position: absolute;
              bottom: 5px;
              right: 25px;
            `}
            icon={Download}
            onClick={this.saveInvoice}
            variant="secondary"
          >
            <FormattedMessage {...messages.download_pdf} />
          </Button>
          <Header
            logo={<Onchain height="45px" width="45px" />}
            subtitle={<FormattedMessage {...messages.subtitle} />}
            title={<FormattedMessage {...messages[isIncoming ? 'title_received' : 'title_sent']} />}
          />
          <Bar mt={2} />
        </Panel.Header>

        <Panel.Body>
          <DataRow
            left={<FormattedMessage {...messages.amount} />}
            right={
              <Flex alignItems="center">
                <CryptoSelector mr={2} />
                <CryptoValue fontSize="xxl" value={amount} />
              </Flex>
            }
          />

          <Bar variant="light" />

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
              <Bar variant="light" />

              <DataRow
                left={<FormattedMessage {...messages.date_confirmed} />}
                right={
                  item.num_confirmations ? (
                    <>
                      <Text>
                        <FormattedDate
                          day="2-digit"
                          month="long"
                          value={item.time_stamp * 1000}
                          year="numeric"
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

              <Bar variant="light" />

              <DataRow
                left={<FormattedMessage {...messages.num_confirmations} />}
                right={<FormattedNumber value={item.num_confirmations} />}
              />

              <Bar variant="light" />

              <DataRow
                left={<FormattedMessage {...messages.address} />}
                right={
                  <Flex>
                    <CopyButton
                      mr={2}
                      name={intl.formatMessage({ ...messages.address })}
                      size="0.7em"
                      value={destAddress}
                    />
                    <Link
                      className="hint--bottom-left"
                      data-hint={destAddress}
                      onClick={() => this.showAddress(destAddress)}
                    >
                      <Truncate text={destAddress} />
                    </Link>
                  </Flex>
                }
              />
            </>
          )}

          {!isIncoming && (
            <>
              <Bar variant="light" />

              <DataRow
                left={<FormattedMessage {...messages.fee} />}
                right={
                  <Flex alignItems="center">
                    <FiatSelector mr={2} />
                    <FiatValue value={item.total_fees} />
                  </Flex>
                }
              />
            </>
          )}

          <Bar variant="light" />
          <DataRow
            left={<FormattedMessage {...messages.status} />}
            right={
              item.block_height ? (
                <>
                  <Flex>
                    <CopyButton
                      mr={2}
                      name={intl.formatMessage({ ...messages.block_id })}
                      size="0.7em"
                      value={item.block_hash}
                    />
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
                  </Flex>

                  {item.maturityHeight && (
                    <Flex alignItems="center" mt={1}>
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

          <Bar variant="light" />

          <DataRow
            left={<FormattedMessage {...messages.tx_hash} />}
            right={
              <Flex>
                <CopyButton
                  mr={2}
                  name={intl.formatMessage({ ...messages.tx_hash })}
                  size="0.7em"
                  value={item.tx_hash}
                />
                <Link
                  className="hint--bottom-left"
                  data-hint={item.tx_hash}
                  onClick={() => this.showTransaction(item.tx_hash)}
                >
                  <Truncate text={item.tx_hash} />
                </Link>
              </Flex>
            }
          />
        </Panel.Body>
      </Panel>
    )
  }
}

export default injectIntl(TransactionModal)
