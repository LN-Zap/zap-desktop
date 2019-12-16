import React from 'react'
import PropTypes from 'prop-types'
import { FormattedDate, FormattedTime, FormattedMessage, injectIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'
import { intlShape } from '@zap/i18n'
import { Bar, DataRow, Header, Panel, Text } from 'components/UI'
import { getTag } from '@zap/utils/crypto'
import { CopyButton, CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import Lightning from 'components/Icon/Lightning'
import messages from './messages'

class PaymentModal extends React.PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    item: PropTypes.object.isRequired,
  }

  render() {
    const { item, intl, ...rest } = this.props
    const memo = item && getTag(item.payment_request, 'description')
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
                <CryptoValue fontSize="xxl" value={item.value_sat} />
              </Flex>
            }
          />

          <Bar variant="light" />
          <DataRow
            left={<FormattedMessage {...messages.current_value} />}
            right={
              <Flex alignItems="center">
                <FiatSelector mr={2} />
                <FiatValue value={item.value_sat} />
              </Flex>
            }
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
              <Flex>
                <CopyButton
                  mr={2}
                  name={intl.formatMessage({ ...messages.preimage })}
                  size="0.7em"
                  value={item.payment_preimage}
                />
                <Text className="hint--bottom-left" data-hint={item.payment_preimage}>
                  <Truncate text={item.payment_preimage} />
                </Text>
              </Flex>
            }
          />
        </Panel.Body>
      </Panel>
    )
  }
}

export default injectIntl(PaymentModal)
