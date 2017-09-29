import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { MdClose } from 'react-icons/lib/md'

import PayForm from './PayForm'
import RequestForm from './RequestForm'

import styles from './Form.scss'

const FORM_TYPES = {
  PAY_FORM: PayForm,
  REQUEST_FORM: RequestForm  
}

class Form extends Component {
  render() {
    console.log('props: ', this.props)
    const { formType, closeForm } = this.props
    
    if (!formType) { return null }

    const FormComponent = FORM_TYPES[formType]

    return (
      <div className={`${styles.outtercontainer} ${formType && styles.open}`}>
        <div className={styles.innercontainer}>
          <div className={styles.esc} onClick={closeForm}>
            <MdClose />
          </div>
          
          <div className={styles.content}>
            content
          </div>
        </div>
      </div>
    )
  }
}


Form.propTypes = {
  
}

export default Form
