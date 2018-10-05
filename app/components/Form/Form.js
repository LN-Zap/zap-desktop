import React from 'react'
import PropTypes from 'prop-types'

import X from 'components/Icon/X'

import Pay from './Pay'
import Request from './Request'

import styles from './Form.scss'

const FORM_TYPES = {
  PAY_FORM: Pay,
  REQUEST_FORM: Request
}

const Form = ({ formType, formProps, closeForm }) => {
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

Form.propTypes = {
  formType: PropTypes.string,
  formProps: PropTypes.object.isRequired,
  closeForm: PropTypes.func.isRequired
}

export default Form
