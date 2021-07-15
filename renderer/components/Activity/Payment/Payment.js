import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import Zap from 'components/Icon/Zap'
import { Message, Text } from 'components/UI'
import { CryptoValue, FiatValue, FormattedDateTime } from 'containers/UI'
import { getDisplayNodeName } from 'reducers/payment/utils'

import ErrorLink from '../ErrorLink'
import messages from './messages'

const ZapIcon = () => <Zap height="1.6em" width="1.6em" />

const Payment = ({
  activity,
  showActivityModal,
  cryptoUnitName,
  showErrorDetailsDialog,
  intl,
  ...rest
}) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      onClick={activity.isSending ? null : () => showActivityModal('PAYMENT', activity.paymentHash)}
      py={2}
      {...rest}
    >
      <Text color="gray" mr={10} textAlign="center" width={24}>
        <ZapIcon />
      </Text>
      <Box
        className="hint--top-right"
        data-hint={intl.formatMessage({ ...messages.type })}
        width={3 / 4}
      >
        <Text mb={1}>{getDisplayNodeName(activity)}</Text>
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
          <Text color="gray" fontSize="xs" fontWeight="normal">
            <FormattedDateTime format="time" value={activity.creationDate * 1000} />
          </Text>
        )}
      </Box>

      <Box
        className="hint--top-left"
        data-hint={intl.formatMessage({ ...messages.amount })}
        width={1 / 4}
      >
        <Box opacity={activity.status === 'failed' ? 0.3 : null}>
          {(() => (
            /* eslint-disable shopify/jsx-no-hardcoded-content */
            <Text mb={1} textAlign="right">
              -&nbsp;
              <CryptoValue value={activity.valueSat} />
              <i> {cryptoUnitName}</i>
            </Text>
            /* eslint-enable shopify/jsx-no-hardcoded-content */
          ))()}
          <Text color="gray" fontSize="xs" fontWeight="normal" textAlign="right">
            <FiatValue style="currency" value={activity.valueSat} />
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

Payment.propTypes = {
  activity: PropTypes.object.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  showErrorDetailsDialog: PropTypes.func.isRequired,
}

export default injectIntl(Payment)
