import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
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
    num_updates
  } = channel
  const [fundingTxid] = channel_point.split(':')

  const data = [
    {
      id: 'channel_point',
      label: <FormattedMessage {...messages.funding_transaction_id_label} />,
      body: <FormattedMessage {...messages.funding_transaction_id_description} />,
      value: (
        <Link
          onClick={() => networkInfo && blockExplorer.showTransaction(networkInfo, fundingTxid)}
        >
          <Truncate text={fundingTxid} maxlen={25} />
        </Link>
      )
    },
    {
      id: 'closing_txid',
      label: <FormattedMessage {...messages.closing_transaction_id_label} />,
      body: <FormattedMessage {...messages.closing_transaction_id_description} />,
      value: (
        <Link
          onClick={() => networkInfo && blockExplorer.showTransaction(networkInfo, closing_txid)}
        >
          <Truncate text={closing_txid} maxlen={25} />
        </Link>
      )
    },
    {
      id: 'num_updates',
      label: <FormattedMessage {...messages.num_updates_label} />,
      body: <FormattedMessage {...messages.num_updates_description} />,
      value: num_updates
    },
    {
      id: 'csv_delay',
      label: <FormattedMessage {...messages.csv_delay_label} />,
      body: <FormattedMessage {...messages.csv_delay_description} />,
      value: csv_delay
    },
    {
      id: 'total_satoshis_sent',
      label: <FormattedMessage {...messages.total_sent_label} />,
      body: <FormattedMessage {...messages.total_sent_description} />,
      value: (
        <>
          <CryptoValue value={total_satoshis_sent} />
          {` `}
          {currencyName}
        </>
      )
    },
    {
      id: 'total_satoshis_received',
      label: <FormattedMessage {...messages.total_received_label} />,
      body: <FormattedMessage {...messages.total_received_description} />,
      value: (
        <>
          <CryptoValue value={total_satoshis_received} />
          {` `}
          {currencyName}
        </>
      )
    },
    {
      id: 'commit_fee',
      label: <FormattedMessage {...messages.commit_fee_label} />,
      body: <FormattedMessage {...messages.commit_fee_description} />,
      value: (
        <>
          <CryptoValue value={commit_fee} />
          {` `}
          {currencyName}
        </>
      )
    },
    {
      id: 'fee_per_kw',
      label: <FormattedMessage {...messages.base_fee_label} />,
      body: <FormattedMessage {...messages.base_fee_description} values={{ currencyName }} />,
      value: (
        <>
          <CryptoValue value={fee_per_kw} />
          {` `}
          {currencyName}
        </>
      )
    }
  ]

  const idsToInclude =
    viewMode === CHANNEL_DATA_VIEW_MODE_BASIC
      ? ['channel_point', 'num_updates', 'csv_delay']
      : [
          'channel_point',
          'closing_txid',
          'num_updates',
          'csv_delay',
          'total_satoshis_sent',
          'total_satoshis_received',
          'commit_fee',
          'fee_per_kw'
        ]

  const rows = idsToInclude.filter(id => channel[id] != null).map(id => data.find(d => d.id === id))

  return (
    <Box {...rest}>
      {rows.map(row => (
        <React.Fragment key={row.id}>
          <Bar variant="light" />
          <DataRow
            left={row.label}
            right={row.value}
            body={viewMode === CHANNEL_DATA_VIEW_MODE_FULL ? row.body : null}
            py={viewMode === CHANNEL_DATA_VIEW_MODE_FULL ? 3 : 2}
            pr={2}
          />
        </React.Fragment>
      ))}
    </Box>
  )
}

ChannelData.propTypes = {
  channel: PropTypes.object.isRequired,
  currencyName: PropTypes.string.isRequired,
  viewMode: PropTypes.oneOf([CHANNEL_DATA_VIEW_MODE_BASIC, CHANNEL_DATA_VIEW_MODE_FULL]),
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }).isRequired
}

ChannelData.defaultProps = {
  viewMode: CHANNEL_DATA_VIEW_MODE_BASIC
}

export default ChannelData
