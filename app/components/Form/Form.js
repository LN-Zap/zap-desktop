import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'components/UI'
import Pay from 'containers/Pay'
import Request from 'containers/Request'

const Form = ({ formType, closeForm }) => {
  if (!formType) {
    return null
  }

  switch (formType) {
    case 'PAY_FORM':
      return (
        <Modal onClose={closeForm}>
          <Pay width={9 / 16} mx="auto" />
        </Modal>
      )

    case 'REQUEST_FORM':
      return (
        <Modal onClose={closeForm}>
          <Request width={9 / 16} mx="auto" />
        </Modal>
      )
  }
}

Form.propTypes = {
  formType: PropTypes.string,
  closeForm: PropTypes.func.isRequired
}

export default Form
