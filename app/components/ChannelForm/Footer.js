import React from 'react'
import PropTypes from 'prop-types'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/lib/fa'
import styles from './Footer.scss'

const Footer = ({ step, changeStep, stepTwoIsValid, submit }) => {
  if ( step === 1 ) { return null }

  // See if the next button on step 2 should be active
  const nextIsInactive = step === 2 && !stepTwoIsValid
  
  // Function that's called when the user clicks "next" in the form
  const nextFunc = () => {  
    if (nextIsInactive) { return }

    changeStep(step + 1)
  }

  const rightButtonText = step === 4 ? 'Submit' : 'Next'
  const rightButtonOnClick = step === 4 ? () => submit() : nextFunc

  return (
    <div className={styles.footer}>
      <div className='buttonContainer'>
        <div className='buttonPrimary' onClick={() => changeStep(step - 1)}>
          Back
        </div>
      </div>
      <div className='buttonContainer' onClick={rightButtonOnClick}>
        <div className={`buttonPrimary ${nextIsInactive && 'inactive'}`}>
          {rightButtonText}
        </div>
      </div>
    </div>
  )
}

Footer.propTypes = {
  step: PropTypes.number.isRequired,
  changeStep: PropTypes.func.isRequired,
  stepTwoIsValid: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired
}

export default Footer
