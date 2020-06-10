import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Bar, Header, Panel } from 'components/UI'
import { RequestSummary } from 'components/Request'
import Lightning from 'components/Icon/Lightning'
import messages from './messages'

const InvoiceModal = ({ cancelInvoice, isInvoiceCancelling, item, showNotification, ...rest }) => (
  <Panel {...rest}>
    <Panel.Header>
      <Header
        logo={<Lightning height="45px" width="45px" />}
        subtitle={<FormattedMessage {...messages.subtitle} />}
        title={
          <FormattedMessage {...messages[item.isSettled ? 'title_received' : 'title_requested']} />
        }
      />
      <Bar mt={2} />
    </Panel.Header>

    <Panel.Body>
      <RequestSummary
        cancelInvoice={cancelInvoice}
        invoice={item}
        isInvoiceCancelling={isInvoiceCancelling}
        showNotification={showNotification}
      />
    </Panel.Body>
  </Panel>
)

InvoiceModal.propTypes = {
  cancelInvoice: PropTypes.func.isRequired,
  isInvoiceCancelling: PropTypes.bool,
  item: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default InvoiceModal
