import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { Modal } from 'components/UI'
import InvoiceModalContainer from 'containers/Activity/InvoiceModalContainer'
import PaymentModalContainer from 'containers/Activity/PaymentModalContainer'
import TransactionModalContainer from 'containers/Activity/TransactionModalContainer'

const MODAL_COMPONENTS = {
  transaction: TransactionModalContainer,
  payment: PaymentModalContainer,
  invoice: InvoiceModalContainer
}

export default class ActivityModal extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    hideActivityModal: PropTypes.func.isRequired
  }

  render() {
    const { item, hideActivityModal } = this.props

    if (!item) {
      return null
    }

    const SpecificModal = MODAL_COMPONENTS[item.type]

    return (
      <Modal onClose={hideActivityModal}>
        <Box width={9 / 16} mx="auto">
          <SpecificModal item={item} />
        </Box>
      </Modal>
    )
  }
}
