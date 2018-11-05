import React from 'react'
import PropTypes from 'prop-types'
import X from 'components/Icon/X'
import { Modal } from 'components/UI'
import Pay from 'containers/Pay'
import Request from './Request'
import styles from './Form.scss'

const Form = ({ formType, formProps, closeForm }) => {
  if (!formType) {
    return null
  }

  switch (formType) {
    case 'PAY_FORM':
      return (
        <div className={styles.container}>
          <Modal onClose={closeForm}>
            <Pay width={9 / 16} mx="auto" />
          </Modal>
        </div>
      )

    case 'REQUEST_FORM':
      return (
        <div className={styles.container}>
          <div className={styles.closeContainer}>
            <span onClick={closeForm}>
              <X />
            </span>
          </div>
          <Request {...formProps} />
        </div>
      )
  }
}

Form.propTypes = {
  formType: PropTypes.string,
  formProps: PropTypes.object.isRequired,
  closeForm: PropTypes.func.isRequired
}

export default Form
