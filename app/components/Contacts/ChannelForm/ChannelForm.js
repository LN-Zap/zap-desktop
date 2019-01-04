import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'components/UI'
import { ConnectManuallyContainer } from '../ConnectManually'
import { SubmitChannelFormContainer } from '../SubmitChannelForm'

const ChannelForm = ({ formType, closeForm }) => {
  if (!formType) {
    return null
  }

  switch (formType) {
    case 'MANUAL_FORM':
      return (
        <Modal onClose={closeForm}>
          <ConnectManuallyContainer width={9 / 16} mx="auto" />
        </Modal>
      )

    case 'SUBMIT_CHANNEL_FORM':
      return (
        <Modal onClose={closeForm}>
          <SubmitChannelFormContainer width={9 / 16} mx="auto" />
        </Modal>
      )
  }
}

ChannelForm.propTypes = {
  formType: PropTypes.string,
  closeForm: PropTypes.func.isRequired
}

export default ChannelForm
