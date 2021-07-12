import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import Lightning from 'components/Icon/Lightning'
import { RequestSummary } from 'components/Request'
import { Bar, Header, Panel } from 'components/UI'

import messages from './messages'

const InvoiceModal = ({
  cancelInvoice,
  clearSettleInvoiceError,
  isHoldInvoiceEnabled,
  isInvoiceCancelling,
  isInvoiceSettling,
  item,
  settleInvoice,
  settleInvoiceError,
  showNotification,
  ...rest
}) => (
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
        clearSettleInvoiceError={clearSettleInvoiceError}
        invoice={item}
        isHoldInvoiceEnabled={isHoldInvoiceEnabled}
        isInvoiceCancelling={isInvoiceCancelling}
        isInvoiceSettling={isInvoiceSettling}
        settleInvoice={settleInvoice}
        settleInvoiceError={settleInvoiceError}
        showNotification={showNotification}
      />
    </Panel.Body>
  </Panel>
)

InvoiceModal.propTypes = {
  cancelInvoice: PropTypes.func.isRequired,
  clearSettleInvoiceError: PropTypes.func.isRequired,
  isHoldInvoiceEnabled: PropTypes.bool,
  isInvoiceCancelling: PropTypes.bool,
  isInvoiceSettling: PropTypes.bool,
  item: PropTypes.object.isRequired,
  settleInvoice: PropTypes.func.isRequired,
  settleInvoiceError: PropTypes.string,
  showNotification: PropTypes.func.isRequired,
}

export default InvoiceModal
