import React from 'react'

import get from 'lodash/get'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import blockExplorer from '@zap/utils/blockExplorer'
import { CoinBig } from '@zap/utils/coin'
import Download from 'components/Icon/Download'
import Onchain from 'components/Icon/Onchain'
import Padlock from 'components/Icon/Padlock'
import { Bar, DataRow, Header, Link, Panel, Span, Text, Button } from 'components/UI'
import { Truncate } from 'components/Util'
import {
  CopyButton,
  CryptoSelector,
  CryptoValue,
  FiatSelector,
  FiatValue,
  FormattedDateTime,
} from 'containers/UI'

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
  }

  saveInvoice = () => {
    const { saveInvoice, item, intl } = this.props
    const destAddress = get(item, 'destAddresses[0]')
    const amount = item.amount || item.limboAmount || 0
    const isIncoming = item.isReceived || (item.limboAmount && CoinBig(item.limboAmount).gt(0))
    const { txHash, timeStamp, numConfirmations } = item
    saveInvoice({
      defaultFilename: txHash && `zap-tx-${txHash.substring(0, 7)}`,
      title: intl.formatMessage(messages[isIncoming ? 'receipt' : 'outgoing_payment_notification']),
      subtitle: intl.formatMessage(messages.receipt_subtitle),
      invoiceData: [
        numConfirmations
          ? [
              intl.formatMessage({ ...messages.date_confirmed }),
              `${intl.formatDate(timeStamp * 1000)} ${intl.formatTime(timeStamp * 1000)}`,
            ]
          : [
              intl.formatMessage({ ...messages.date_confirmed }),
              intl.formatMessage({ ...messages.unconfirmed }),
            ],
        [intl.formatMessage({ ...messages.address }), destAddress, {}, { fontSize: 10 }],
        txHash && [intl.formatMessage({ ...messages.tx_hash }), txHash, {}, { fontSize: 10 }],
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
    const { intl, item, ...rest } = this.props
    const destAddress = get(item, 'destAddresses[0]')
    const amount = item.amount || item.limboAmount || 0
    const isIncoming = item.isReceived || (item.limboAmount && CoinBig(item.limboAmount).gt(0))

    return (
      <Panel {...rest}>
        <Panel.Header>
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

          {CoinBig(item.numConfirmations).gte(0) && (
            <>
              <Bar variant="light" />

              <DataRow
                left={<FormattedMessage {...messages.date_confirmed} />}
                right={
                  item.numConfirmations ? (
                    <>
                      <Text>
                        <FormattedDateTime
                          format="date"
                          month="long"
                          value={item.timeStamp * 1000}
                        />
                      </Text>
                      <Text>
                        <FormattedDateTime format="time" value={item.timeStamp * 1000} />
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
                right={<FormattedNumber value={item.numConfirmations} />}
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
                    <FiatValue value={item.totalFees} />
                  </Flex>
                }
              />
            </>
          )}

          <Bar variant="light" />
          <DataRow
            left={<FormattedMessage {...messages.status} />}
            right={
              item.blockHeight ? (
                <>
                  <Flex>
                    <CopyButton
                      mr={2}
                      name={intl.formatMessage({ ...messages.block_id })}
                      size="0.7em"
                      value={item.blockHash}
                    />
                    <Link
                      className="hint--bottom-left"
                      data-hint={item.blockHash}
                      onClick={() => this.showBlock(item.blockHash)}
                    >
                      <FormattedMessage
                        {...messages.block_height}
                        values={{ height: item.blockHeight }}
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
                  value={item.txHash}
                />
                <Link
                  className="hint--bottom-left"
                  data-hint={item.txHash}
                  onClick={() => this.showTransaction(item.txHash)}
                >
                  <Truncate text={item.txHash} />
                </Link>
              </Flex>
            }
          />
        </Panel.Body>
        <Panel.Footer>
          <Button
            icon={Download}
            onClick={this.saveInvoice}
            sx={{
              position: 'absolute',
              bottom: 3,
              right: 4,
            }}
            variant="secondary"
          >
            <FormattedMessage {...messages.download_pdf} />
          </Button>
        </Panel.Footer>
      </Panel>
    )
  }
}

export default injectIntl(TransactionModal)
