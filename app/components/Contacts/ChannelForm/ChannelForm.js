import React from 'react'
import PropTypes from 'prop-types'

import X from 'components/Icon/X'

import ConnectManually from '../ConnectManually'
import SubmitChannelForm from '../SubmitChannelForm'

import styles from './ChannelForm.scss'

const FORM_TYPES = {
  MANUAL_FORM: ConnectManually,
  SUBMIT_CHANNEL_FORM: SubmitChannelForm
}

const ChannelForm = ({ formType, formProps, closeForm }) => {
  if (!formType) {
    return null
  }

  const FormComponent = FORM_TYPES[formType]
  return (
    <div className={styles.container}>
      <div className={styles.closeContainer}>
        <span onClick={closeForm}>
          <X />
        </span>
      </div>
      <FormComponent {...formProps} />
    </div>
  )
}

ChannelForm.propTypes = {
  formType: PropTypes.string,
  formProps: PropTypes.object.isRequired,
  closeForm: PropTypes.func.isRequired
}

export default ChannelForm
