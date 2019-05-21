import React from 'react'
import PropTypes from 'prop-types'
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Bar, DataRow, Header, Panel, Text } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import Lightning from 'components/Icon/Lightning'
import messages from './messages'

export default class PaymentModal extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  render() {
    const { item, ...rest } = this.props
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
                <CryptoValue fontSize="xxl" value={item.value} />
              </Flex>
            }
          />

          <Bar variant="light" />

          <DataRow
            left={<FormattedMessage {...messages.current_value} />}
            right={
              <Flex alignItems="center">
                <FiatSelector mr={2} />
                <FiatValue value={item.value} />
              </Flex>
            }
          />

          <Bar variant="light" />

          <DataRow
            left={<FormattedMessage {...messages.date_sent} />}
            right={
              <>
                <Text>
                  <FormattedDate
                    day="2-digit"
                    month="long"
                    value={item.creation_date * 1000}
                    year="numeric"
                  />
                </Text>
                <Text>
                  <FormattedTime value={item.creation_date * 1000} />
                </Text>
              </>
            }
          />

          <Bar variant="light" />

          <DataRow
            left={<FormattedMessage {...messages.preimage} />}
            right={
              <Text className="hint--bottom-left" data-hint={item.payment_preimage}>
                <Truncate text={item.payment_preimage} />
              </Text>
            }
          />
        </Panel.Body>
      </Panel>
    )
  }
}
