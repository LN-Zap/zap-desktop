import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { InvoiceModal } from 'components/Activity/InvoiceModal'
import { PaymentModal } from 'components/Activity/PaymentModal'
import { TransactionModal } from 'components/Activity/TransactionModal'

export default class ActivityModal extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    networkInfo: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    showNotification: PropTypes.func.isRequired,
  }

  render() {
    const { item, networkInfo, showNotification, ...rest } = this.props

    if (!item) {
      return null
    }

    const MODAL_COMPONENTS = {
      transaction: {
        component: TransactionModal,
        props: { item, networkInfo },
      },
      payment: {
        component: PaymentModal,
        props: { item },
      },
      invoice: {
        component: InvoiceModal,
        props: { item, showNotification },
      },
    }

    const SpecificModal = MODAL_COMPONENTS[item.type].component

    return (
      <Box {...rest}>
        <SpecificModal {...MODAL_COMPONENTS[item.type].props} />
      </Box>
    )
  }
}
