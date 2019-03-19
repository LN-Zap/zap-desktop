import React from 'react'
import PropTypes from 'prop-types'
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { opacity } from 'styled-system'
import { Box as BaseBox } from 'rebass'
import { blockExplorer } from 'lib/utils'
import { Bar, DataRow, Link } from 'components/UI'
import { Truncate } from 'components/Util'
import { CryptoValue } from 'containers/UI'
import { CHANNEL_DATA_VIEW_MODE_BASIC, CHANNEL_DATA_VIEW_MODE_FULL } from './constants'
import messages from './messages'

const Box = styled(BaseBox)(opacity)

const ChannelData = ({ channel, currencyName, networkInfo, viewMode, ...rest }) => {
  const {
    channel_point,
    closing_txid,
    commit_fee,
    fee_per_kw,
    total_satoshis_sent,
    total_satoshis_received,
    csv_delay,
    num_updates,
    fundingTxTimestamp,
  } = channel

  // Define output for each data property that we might want to display.
  const data = {
    channel_point: () => {
      const [fundingTxid] = channel_point ? channel_point.split(':') : []
      return {
        label: <FormattedMessage {...messages.funding_transaction_id_label} />,
        body: <FormattedMessage {...messages.funding_transaction_id_description} />,
        value: (
          <Link
            onClick={() => networkInfo && blockExplorer.showTransaction(networkInfo, fundingTxid)}
          >
            <Truncate maxlen={25} text={fundingTxid} />
          </Link>
        ),
      }
    },

    fundingTxTimestamp: () => ({
      label: <FormattedMessage {...messages.funding_date_label} />,
      body: <FormattedMessage {...messages.funding_date_description} />,
      value: (
        <>
          <FormattedDate
            day="2-digit"
            month="short"
            value={fundingTxTimestamp * 1000}
            year="numeric"
          />{' '}
          <FormattedTime value={fundingTxTimestamp * 1000} />
        </>
      ),
    }),

    closing_txid: () => ({
      label: <FormattedMessage {...messages.closing_transaction_id_label} />,
      body: <FormattedMessage {...messages.closing_transaction_id_description} />,
      value: (
        <Link
          onClick={() => networkInfo && blockExplorer.showTransaction(networkInfo, closing_txid)}
        >
          <Truncate maxlen={25} text={closing_txid} />
        </Link>
      ),
    }),

    num_updates: () => ({
      label: <FormattedMessage {...messages.num_updates_label} />,
      body: <FormattedMessage {...messages.num_updates_description} />,
      value: num_updates,
    }),

    csv_delay: () => ({
      label: <FormattedMessage {...messages.csv_delay_label} />,
      body: <FormattedMessage {...messages.csv_delay_description} />,
      value: csv_delay,
    }),

    total_satoshis_sent: () => ({
      label: <FormattedMessage {...messages.total_sent_label} />,
      body: <FormattedMessage {...messages.total_sent_description} />,
      value: (
        <>
          <CryptoValue value={total_satoshis_sent} />
          {` `}
          {currencyName}
        </>
      ),
    }),

    total_satoshis_received: () => ({
      label: <FormattedMessage {...messages.total_received_label} />,
      body: <FormattedMessage {...messages.total_received_description} />,
      value: (
        <>
          <CryptoValue value={total_satoshis_received} />
          {` `}
          {currencyName}
        </>
      ),
    }),

    commit_fee: () => ({
      label: <FormattedMessage {...messages.commit_fee_label} />,
      body: <FormattedMessage {...messages.commit_fee_description} />,
      value: (
        <>
          <CryptoValue value={commit_fee} />
          {` `}
          {currencyName}
        </>
      ),
    }),

    fee_per_kw: () => ({
      label: <FormattedMessage {...messages.base_fee_label} />,
      body: <FormattedMessage {...messages.base_fee_description} values={{ currencyName }} />,
      value: (
        <>
          <CryptoValue value={fee_per_kw} />
          {` `}
          {currencyName}
        </>
      ),
    }),
  }

  // Determine which of the properties we will display based on the active view mode.
  const candidateProps =
    viewMode === CHANNEL_DATA_VIEW_MODE_BASIC
      ? ['channel_point', 'num_updates', 'csv_delay']
      : [
          'channel_point',
          'fundingTxTimestamp',
          'closing_txid',
          'num_updates',
          'csv_delay',
          'total_satoshis_sent',
          'total_satoshis_received',
          'commit_fee',
          'fee_per_kw',
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
  currencyName: PropTypes.string.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  viewMode: PropTypes.oneOf([CHANNEL_DATA_VIEW_MODE_BASIC, CHANNEL_DATA_VIEW_MODE_FULL]),
}

ChannelData.defaultProps = {
  viewMode: CHANNEL_DATA_VIEW_MODE_BASIC,
}

export default ChannelData
