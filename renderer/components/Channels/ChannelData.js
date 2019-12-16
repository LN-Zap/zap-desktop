import React from 'react'
import PropTypes from 'prop-types'
import { FormattedDate, FormattedTime, FormattedMessage, injectIntl } from 'react-intl'
import styled from 'styled-components'
import { opacity } from 'styled-system'
import { Box as BaseBox, Flex } from 'rebass/styled-components'
import { intlShape } from '@zap/i18n'
import blockExplorer from '@zap/utils/blockExplorer'
import { Bar, DataRow, Link, Text } from 'components/UI'
import { Truncate } from 'components/Util'
import { CopyButton, CryptoValue } from 'containers/UI'
import { CHANNEL_DATA_VIEW_MODE_BASIC, CHANNEL_DATA_VIEW_MODE_FULL } from './constants'
import messages from './messages'

const Box = styled(BaseBox)(opacity)

const ChannelData = ({ channel, cryptoUnitName, intl, networkInfo, viewMode, ...rest }) => {
  const {
    channel_point,
    closing_txid,
    commit_fee,
    fee_per_kw,
    local_chan_reserve_sat,
    total_satoshis_sent,
    total_satoshis_received,
    csv_delay,
    activity,
    num_updates,
    fundingTxTimestamp,
    remote_chan_reserve_sat,
  } = channel

  // Define output for each data property that we might want to display.
  const data = {
    channel_point: () => {
      const [fundingTxid] = channel_point ? channel_point.split(':') : []
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
          <FormattedDate
            day="2-digit"
            month="short"
            value={fundingTxTimestamp * 1000}
            year="numeric"
          />{' '}
          <FormattedTime value={fundingTxTimestamp * 1000} />
        </Text>
      ),
    }),

    closing_txid: () => ({
      label: <FormattedMessage {...messages.closing_transaction_id_label} />,
      body: <FormattedMessage {...messages.closing_transaction_id_description} />,
      value: (
        <Flex>
          <CopyButton
            mr={2}
            name={intl.formatMessage({ ...messages.transaction_id })}
            size="0.7em"
            value={closing_txid}
          />
          <Link
            onClick={() => networkInfo && blockExplorer.showTransaction(networkInfo, closing_txid)}
          >
            <Truncate maxlen={25} text={closing_txid} />
          </Link>
        </Flex>
      ),
    }),

    local_chan_reserve_sat: () => ({
      label: <FormattedMessage {...messages.local_chan_reserve_sat_label} />,
      body: <FormattedMessage {...messages.local_chan_reserve_sat_description} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={local_chan_reserve_sat} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),

    remote_chan_reserve_sat: () => ({
      label: <FormattedMessage {...messages.remote_chan_reserve_sat_label} />,
      body: <FormattedMessage {...messages.remote_chan_reserve_sat_description} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={remote_chan_reserve_sat} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),

    num_updates: () => ({
      label: <FormattedMessage {...messages.num_updates_label} />,
      body: <FormattedMessage {...messages.num_updates_description} />,
      value: <Text>{num_updates}</Text>,
    }),

    activity: () => ({
      label: <FormattedMessage {...messages.channel_activity} />,
      body: <FormattedMessage {...messages.channel_activity_description} />,
      value: `${activity}%`,
    }),

    csv_delay: () => ({
      label: <FormattedMessage {...messages.csv_delay_label} />,
      body: <FormattedMessage {...messages.csv_delay_description} />,
      value: <Text>{csv_delay}</Text>,
    }),

    total_satoshis_sent: () => ({
      label: <FormattedMessage {...messages.total_sent_label} />,
      body: <FormattedMessage {...messages.total_sent_description} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={total_satoshis_sent} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),

    total_satoshis_received: () => ({
      label: <FormattedMessage {...messages.total_received_label} />,
      body: <FormattedMessage {...messages.total_received_description} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={total_satoshis_received} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),

    commit_fee: () => ({
      label: <FormattedMessage {...messages.commit_fee_label} />,
      body: <FormattedMessage {...messages.commit_fee_description} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={commit_fee} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),

    fee_per_kw: () => ({
      label: <FormattedMessage {...messages.base_fee_label} />,
      body: <FormattedMessage {...messages.base_fee_description} values={{ cryptoUnitName }} />,
      value: (
        <Text>
          <FormattedMessage
            {...messages.crypto_amount_with_unit}
            values={{ amount: <CryptoValue value={fee_per_kw} />, cryptoUnitName }}
          />
        </Text>
      ),
    }),
  }
  // Channel is closing
  const isClosing = Boolean(closing_txid)
  // Determine which of the properties we will display based on the active view mode.
  const candidateProps =
    viewMode === CHANNEL_DATA_VIEW_MODE_BASIC
      ? [isClosing ? 'closing_txid' : 'channel_point', 'num_updates', 'csv_delay', 'activity']
      : [
          'channel_point',
          'fundingTxTimestamp',
          'closing_txid',
          'num_updates',
          'csv_delay',
          'activity',
          'total_satoshis_sent',
          'total_satoshis_received',
          'commit_fee',
          'fee_per_kw',
          'local_chan_reserve_sat',
          'remote_chan_reserve_sat',
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
