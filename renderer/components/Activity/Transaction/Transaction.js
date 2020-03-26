import React from 'react'
import PropTypes from 'prop-types'
import findLast from 'lodash/findLast'
import { FormattedTime, FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import config from 'config'
import { intlShape } from '@zap/i18n'
import { Message, Text } from 'components/UI'
import ChainLink from 'components/Icon/ChainLink'
import { CryptoValue, FiatValue } from 'containers/UI'
import ErrorLink from '../ErrorLink'
import messages from './messages'

const { pending, confirmed } = config.onchainFinality

// finality to color mapping
const DISPLAY_PARAMS = [
  { finality: pending, msg: messages.pending, color: 'primaryAccent' },
  { finality: confirmed, msg: messages.confirmed, color: 'superGreen' },
]

const Transaction = ({
  activity,
  showActivityModal,
  showErrorDetailsDialog,
  cryptoUnitName,
  intl,
  ...rest
}) => {
  let type = activity.isReceived ? 'received' : 'sent'
  if (activity.isFunding) {
    type = 'funding'
  } else if (activity.isClosing) {
    type = 'closing'
  }
  const renderConfirmations = () => {
    const { num_confirmations } = activity

    // returns color for the current number of confirmations
    const getDisplayParams = () =>
      findLast(DISPLAY_PARAMS, ({ finality }) => num_confirmations >= finality) || DISPLAY_PARAMS[0]

    if (num_confirmations > confirmed) {
      return (
        <Text color="gray" fontSize="xs" fontWeight="normal">
          <FormattedTime value={activity.time_stamp * 1000} />
        </Text>
      )
    }
    const { color, msg } = getDisplayParams()
    return (
      <Text color={color} fontSize="xs" fontWeight="normal">
        <FormattedMessage {...msg} />
      </Text>
    )
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      onClick={activity.isSending ? null : () => showActivityModal('TRANSACTION', activity.tx_hash)}
      py={2}
      {...rest}
    >
      <Text color="gray" mr={10} textAlign="center" width={24}>
        <ChainLink />
      </Text>
      <Box
        className="hint--top-right"
        data-hint={intl.formatMessage({ ...messages.type })}
        width={3 / 4}
      >
        <Text mb={1}>
          {activity.closeType ? (
            <FormattedMessage {...messages[`closetype_${activity.closeType.toLowerCase()}`]} />
          ) : (
            <FormattedMessage {...messages[type]} />
          )}
        </Text>

        {activity.isSending ? (
          <>
            {activity.status === 'sending' && (
              <Message variant="processing">
                <FormattedMessage {...messages.status_processing} />
              </Message>
            )}
            {activity.status === 'successful' && (
              <Message variant="success">
                <FormattedMessage {...messages.status_success} />
              </Message>
            )}
            {activity.status === 'failed' && (
              <ErrorLink onClick={() => showErrorDetailsDialog({ details: activity.error })}>
                <FormattedMessage {...messages.status_error} />
              </ErrorLink>
            )}
          </>
        ) : (
          renderConfirmations()
        )}
      </Box>

      <Box
        className="hint--top-left"
        data-hint={intl.formatMessage({ ...messages.amount })}
        width={1 / 4}
      >
        <Box opactiy={activity.status === 'failed' ? 0.2 : null}>
          <Text color={activity.isReceived ? 'superGreen' : null} mb={1} textAlign="right">
            {activity.isReceived ? `+ ` : `- `}
            <CryptoValue value={activity.amount} />
            <i> {cryptoUnitName}</i>
          </Text>
          <Text color="gray" fontSize="xs" fontWeight="normal" textAlign="right">
            <FiatValue style="currency" value={activity.amount} />
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

Transaction.displayName = 'Transaction'

Transaction.propTypes = {
  activity: PropTypes.object.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  showErrorDetailsDialog: PropTypes.func.isRequired,
}

export default injectIntl(Transaction)
