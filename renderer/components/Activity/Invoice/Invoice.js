import React from 'react'
import PropTypes from 'prop-types'
import { FormattedTime, FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import { intlShape } from '@zap/i18n'
import { Text } from 'components/UI'
import Zap from 'components/Icon/Zap'
import { CryptoValue, FiatValue } from 'containers/UI'
import messages from './messages'
import Clock from 'components/Icon/Clock'

const ZapIcon = () => <Zap height="1.6em" width="1.6em" />

const Invoice = ({ activity, showActivityModal, cryptoUnitName, intl, ...rest }) => (
  <Flex
    alignItems="center"
    justifyContent="space-between"
    onClick={() => showActivityModal('INVOICE', activity.payment_request)}
    py={2}
    {...rest}
  >
    <Text color="gray" mr={10} textAlign="center" width={24}>
      {activity.settled ? <ZapIcon /> : <Clock />}
    </Text>
    <Box
      className="hint--top-right"
      data-hint={intl.formatMessage({
        ...messages[activity.settled ? 'type_paid' : 'type_unpaid'],
      })}
      width={3 / 4}
    >
      <Text mb={1}>
        <FormattedMessage {...messages[activity.settled ? 'received' : 'requested']} />
      </Text>
      <Text color="gray" fontSize="xs" fontWeight="normal">
        <FormattedTime
          value={activity.settled ? activity.settle_date * 1000 : activity.creation_date * 1000}
        />
      </Text>
    </Box>

    <Box
      className="hint--top-left"
      data-hint={intl.formatMessage({ ...messages.amount })}
      width={1 / 4}
    >
      {(() => (
        /* eslint-disable shopify/jsx-no-hardcoded-content */
        <Text color="superGreen" mb={1} textAlign="right">
          +&nbsp;
          <CryptoValue value={activity.finalAmount} />
          <i> {cryptoUnitName}</i>
        </Text>
        /* eslint-enable shopify/jsx-no-hardcoded-content */
      ))()}
      <Text color="gray" fontSize="xs" fontWeight="normal" textAlign="right">
        <FiatValue style="currency" value={activity.finalAmount} />
      </Text>
    </Box>
  </Flex>
)

Invoice.propTypes = {
  activity: PropTypes.object.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  showActivityModal: PropTypes.func.isRequired,
}

export default injectIntl(Invoice)
