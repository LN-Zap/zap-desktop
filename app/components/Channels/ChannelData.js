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
import messages from './messages'

const Box = styled(BaseBox)(opacity)

const ChannelData = ({ channel, currencyName, networkInfo, viewMode, ...rest }) => {
  const {
    channel_point,
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
      id: 'funding_transaction_id',
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
      id: 'num_updates',
      label: <FormattedMessage {...messages.num_updates_label} />,
      body: <FormattedMessage {...messages.num_updates_description} />,
      value:
        typeof num_updates !== 'undefined' ? (
          num_updates
        ) : (
          <FormattedMessage {...messages.unknown} />
        )
    },
    {
      id: 'csv_delay',
      label: <FormattedMessage {...messages.csv_delay_label} />,
      body: <FormattedMessage {...messages.csv_delay_description} />,
      value:
        typeof csv_delay !== 'undefined' ? (
          <FormattedMessage {...messages.csv_delay_value} values={{ csvDelay: csv_delay }} />
        ) : (
          <FormattedMessage {...messages.unknown} />
        )
    }
  ]

  if (viewMode === 'full') {
    data.push(
      {
        id: 'total_sent',
        label: <FormattedMessage {...messages.total_sent_label} />,
        body: <FormattedMessage {...messages.total_sent_description} />,
        value:
          typeof total_satoshis_sent !== 'undefined' ? (
            <>
              <CryptoValue value={total_satoshis_sent} />
              {` `}
              {currencyName}
            </>
          ) : (
            <FormattedMessage {...messages.unknown} />
          )
      },
      {
        id: 'total_received',
        label: <FormattedMessage {...messages.total_received_label} />,
        body: <FormattedMessage {...messages.total_received_description} />,
        value:
          typeof total_satoshis_received !== 'undefined' ? (
            <>
              <CryptoValue value={total_satoshis_received} />
              {` `}
              {currencyName}
            </>
          ) : (
            <FormattedMessage {...messages.unknown} />
          )
      },
      {
        id: 'commit_fee',
        label: <FormattedMessage {...messages.commit_fee_label} />,
        body: <FormattedMessage {...messages.commit_fee_description} />,
        value:
          typeof commit_fee !== 'undefined' ? (
            <>
              <CryptoValue value={commit_fee} />
              {` `}
              {currencyName}
            </>
          ) : (
            <FormattedMessage {...messages.unknown} />
          )
      },
      {
        id: 'base_fee',
        label: <FormattedMessage {...messages.base_fee_label} />,
        body: <FormattedMessage {...messages.base_fee_description} values={{ currencyName }} />,
        value:
          typeof fee_per_kw !== 'undefined' ? (
            <>
              <CryptoValue value={fee_per_kw} />
              {` `}
              {currencyName}
            </>
          ) : (
            <FormattedMessage {...messages.unknown} />
          )
      }
    )
  }

  return (
    <Box {...rest}>
      {data.map(item => (
        <React.Fragment key={item.id}>
          <Bar opacity={0.3} />
          <DataRow
            left={item.label}
            right={item.value}
            body={viewMode === 'full' ? item.body : null}
            py={viewMode === 'full' ? 3 : 2}
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
  viewMode: PropTypes.oneOf(['basic', 'full']),
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }).isRequired
}

ChannelData.defaultProps = {
  viewMode: 'basic'
}

export default ChannelData
