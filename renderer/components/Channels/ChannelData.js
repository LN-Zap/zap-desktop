import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box as BaseBox, Flex } from 'rebass/styled-components'
import styled from 'styled-components'
import { opacity } from 'styled-system'

import { intlShape } from '@zap/i18n'
import blockExplorer from '@zap/utils/blockExplorer'
import { Bar, DataRow, Link, Text } from 'components/UI'
import { Truncate } from 'components/Util'
import { CopyButton, CryptoValue, FormattedDateTime } from 'containers/UI'

import { CHANNEL_DATA_VIEW_MODE_BASIC, CHANNEL_DATA_VIEW_MODE_FULL } from './constants'
import messages from './messages'

const Box = styled(BaseBox)(opacity)

const ChannelData = ({ channel, cryptoUnitName, intl, networkInfo, viewMode, ...rest }) => {
  const {
    channelPoint,
    closingTxid,
    commitFee,
    feePerKw,
    localChanReserveSat,
    totalSatoshisSent,
    totalSatoshisReceived,
    csvDelay,
    maturityHeight,
    blocksTilMaturity,
    activity,
    numUpdates,
    fundingTxTimestamp,
    remoteChanReserveSat,
  } = channel

  // Define output for each data property that we might want to display.
  const data = {
    channelPoint: () => {
      const [fundingTxid] = channelPoint ? channelPoint.split(':') : []
      return {
        label: <FormattedMessage {...messages.funding_transaction_id_label} />,
        body: <FormattedMessage {...messages.funding_transaction_id_description} />,
        value: (
          <Flex>
            <CopyButton
              mr={2}
              name={intl.formatMessage({ ...messages.transaction_id })}
              size="0.7em"
              value={fundingTxid}
            />
            <Link
              onClick={() => networkInfo && blockExplorer.showTransaction(networkInfo, fundingTxid)}
            >
              <Truncate maxlen={25} text={fundingTxid} />
            </Link>
          </Flex>
        ),
      }
    },

    fundingTxTimestamp: () => ({
      label: <FormattedMessage {...messages.funding_date_label} />,
      body: <FormattedMessage {...messages.funding_date_description} />,
      value: (
        <Text>
          <FormattedDateTime month="short" value={fundingTxTimestamp * 1000} />
        </Text>
      ),
    }),

    closingTxid: () => ({
      label: <FormattedMessage {...messages.closing_transaction_id_label} />,
      body: <FormattedMessage {...messages.closing_transaction_id_description} />,
      value: (
        <Flex>
          <CopyButton
            mr={2}
            name={intl.formatMessage({ ...messages.transaction_id })}
            size="0.7em"
            value={closingTxid}
          />
          <Link
            onClick={() => networkInfo && blockExplorer.showTransaction(networkInfo, closingTxid)}
          >
            <Truncate maxlen={25} text={closingTxid} />
          </Link>
        </Flex>
      ),
    }),

    localChanReserveSat: () => ({
      label: <FormattedMessage {...messages.local_chan_reserve_sat_label} />,
      body: <FormattedMessage {...messages.local_chan_reserve_sat_description} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={localChanReserveSat} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),

    remoteChanReserveSat: () => ({
      label: <FormattedMessage {...messages.remote_chan_reserve_sat_label} />,
      body: <FormattedMessage {...messages.remote_chan_reserve_sat_description} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={remoteChanReserveSat} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),

    numUpdates: () => ({
      label: <FormattedMessage {...messages.num_updates_label} />,
      body: <FormattedMessage {...messages.num_updates_description} />,
      value: <Text>{numUpdates}</Text>,
    }),

    activity: () => ({
      label: <FormattedMessage {...messages.channel_activity} />,
      body: <FormattedMessage {...messages.channel_activity_description} />,
      value: `${activity}%`,
    }),

    csvDelay: () => ({
      label: <FormattedMessage {...messages.csv_delay_label} />,
      body: <FormattedMessage {...messages.csv_delay_description} />,
      value: <Text>{csvDelay}</Text>,
    }),

    maturityHeight: () => ({
      label: <FormattedMessage {...messages.maturity_height_label} />,
      body: <FormattedMessage {...messages.maturity_height_description} />,
      value: <Text>{maturityHeight}</Text>,
    }),

    blocksTilMaturity: () => ({
      label: <FormattedMessage {...messages.blocks_til_maturity_label} />,
      body: <FormattedMessage {...messages.blocks_til_maturity_description} />,
      value: <Text>{blocksTilMaturity}</Text>,
    }),

    totalSatoshisSent: () => ({
      label: <FormattedMessage {...messages.total_sent_label} />,
      body: <FormattedMessage {...messages.total_sent_description} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={totalSatoshisSent} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),

    totalSatoshisReceived: () => ({
      label: <FormattedMessage {...messages.total_received_label} />,
      body: <FormattedMessage {...messages.total_received_description} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={totalSatoshisReceived} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),

    commitFee: () => ({
      label: <FormattedMessage {...messages.commit_fee_label} />,
      body: <FormattedMessage {...messages.commit_fee_description} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={commitFee} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),

    feePerKw: () => ({
      label: <FormattedMessage {...messages.base_fee_label} />,
      body: <FormattedMessage {...messages.base_fee_description} values={{ cryptoUnitName }} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={feePerKw} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),
  }
  // Channel is closing
  const isClosing = Boolean(closingTxid)
  // Determine which of the properties we will display based on the active view mode.
  const candidateProps =
    viewMode === CHANNEL_DATA_VIEW_MODE_BASIC
      ? [isClosing ? 'closingTxid' : 'channelPoint', 'numUpdates', 'csvDelay', 'activity']
      : [
          'fundingTxTimestamp',
          'channelPoint',
          'closingTxid',
          'numUpdates',
          'csvDelay',
          'maturityHeight',
          'blocksTilMaturity',
          'activity',
          'totalSatoshisSent',
          'totalSatoshisReceived',
          'commitFee',
          'feePerKw',
          'localChanReserveSat',
          'remoteChanReserveSat',
        ]

  // filter out keys where the value is null or undefined so that we don't render rows where we have no data.
  const propsToRender = candidateProps.filter(id => channel[id] != null)

  // Generate output for each row to be rendered.
  const rows = propsToRender.map(id => ({
    id,
    data: data[id](),
  }))

  // Assemble the data into a series of data rows.
  return (
    <Box {...rest}>
      {rows.map(row => {
        const {
          id,
          data: { label, body, value },
        } = row

        return (
          <React.Fragment key={id}>
            <Bar variant="light" />
            <DataRow
              body={viewMode === CHANNEL_DATA_VIEW_MODE_FULL ? body : null}
              left={label}
              pr={2}
              py={viewMode === CHANNEL_DATA_VIEW_MODE_FULL ? 3 : 2}
              right={value}
            />
          </React.Fragment>
        )
      })}
    </Box>
  )
}

ChannelData.propTypes = {
  channel: PropTypes.object.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  viewMode: PropTypes.oneOf([CHANNEL_DATA_VIEW_MODE_BASIC, CHANNEL_DATA_VIEW_MODE_FULL]),
}

ChannelData.defaultProps = {
  viewMode: CHANNEL_DATA_VIEW_MODE_BASIC,
}

export default injectIntl(ChannelData)
