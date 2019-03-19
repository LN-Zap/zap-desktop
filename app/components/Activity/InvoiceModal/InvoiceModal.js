import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Bar, Header, Panel } from 'components/UI'
import { RequestSummary } from 'components/Request'
import Lightning from 'components/Icon/Lightning'
import messages from './messages'

export default class InvoiceModal extends React.PureComponent {
  static propTypes = {
    /** Invoice */
    item: PropTypes.object.isRequired,
    /** Show a notification. */
    showNotification: PropTypes.func.isRequired,
  }

  render() {
    const { item, showNotification, ...rest } = this.props

    return (
      <Panel {...rest}>
        <Panel.Header>
          <Header
            logo={<Lightning height="45px" width="45px" />}
            subtitle={<FormattedMessage {...messages.subtitle} />}
            title={
              <FormattedMessage
                {...messages[item.settled ? 'title_received' : 'title_requested']}
              />
            }
          />
          <Bar mt={2} />
        </Panel.Header>

        <Panel.Body>
          <RequestSummary
            invoice={item}
            payReq={item.payment_request}
            showNotification={showNotification}
          />
        </Panel.Body>
      </Panel>
    )
  }
}
