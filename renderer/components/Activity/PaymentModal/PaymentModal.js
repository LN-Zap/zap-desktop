import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { getTag } from '@zap/utils/crypto'
import Lightning from 'components/Icon/Lightning'
import { Bar, DataRow, Header, Panel, Text } from 'components/UI'
import { Truncate } from 'components/Util'
import {
  CopyButton,
  CryptoSelector,
  CryptoValue,
  FiatSelector,
  FiatValue,
  FormattedDateTime,
} from 'containers/UI'
import { getDisplayNodeName } from 'reducers/payment/utils'

import messages from './messages'
import Route from './Route'

class PaymentModal extends React.PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    item: PropTypes.object.isRequired,
  }

  render() {
    const { item, intl, ...rest } = this.props
    const memo = item && getTag(item.paymentRequest, 'description')
    const htlcs = item.htlcs.filter(htlc => htlc.status === 'SUCCEEDED')
    const isMpp = htlcs.length > 1
    const isRouted = htlcs.filter(htlc => htlc.route.hops.length > 1).length > 0

    return (
      <Panel {...rest}>
        <Panel.Header>
          <Header
            logo={<Lightning height="45px" width="45px" />}
            subtitle={<FormattedMessage {...messages.subtitle} />}
            title={<FormattedMessage {...messages.title_sent} />}
          />
          <Bar mt={2} />
        </Panel.Header>

        <Panel.Body>
          <DataRow
            left={<FormattedMessage {...messages.amount} />}
            right={
              <Flex alignItems="center">
                <CryptoSelector mr={2} />
                <CryptoValue fontSize="xxl" value={item.valueSat} />
              </Flex>
            }
          />

          <Bar variant="light" />
          <DataRow
            left={<FormattedMessage {...messages.current_value} />}
            right={
              <Flex alignItems="center">
                <FiatSelector mr={2} />
                <FiatValue value={item.valueSat} />
              </Flex>
            }
          />

          <Bar variant="light" />
          <DataRow
            left={<FormattedMessage {...messages.destination} />}
            right={getDisplayNodeName(item)}
          />

          {memo && (
            <>
              <Bar variant="light" />
              <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} />
            </>
          )}

          <Bar variant="light" />

          <DataRow
            left={<FormattedMessage {...messages.date_sent} />}
            right={
              <>
                <Text>
                  <FormattedDateTime format="date" month="long" value={item.creationDate * 1000} />
                </Text>
                <Text>
                  <FormattedDateTime format="time" value={item.creationDate * 1000} />
                </Text>
              </>
            }
          />

          <Bar variant="light" />

          <DataRow
            left={<FormattedMessage {...messages.preimage} />}
            right={
              <Flex>
                <CopyButton
                  mr={2}
                  name={intl.formatMessage({ ...messages.preimage })}
                  size="0.7em"
                  value={item.paymentPreimage}
                />
                <Text className="hint--bottom-left" data-hint={item.paymentPreimage}>
                  <Truncate text={item.paymentPreimage} />
                </Text>
              </Flex>
            }
          />

          {(isMpp || isRouted) && (
            <>
              <Bar variant="light" />

              <DataRow
                left={<FormattedMessage {...messages.htlc_title} />}
                right={<Route htlcs={htlcs} />}
              />
            </>
          )}
        </Panel.Body>
      </Panel>
    )
  }
}

export default injectIntl(PaymentModal)
