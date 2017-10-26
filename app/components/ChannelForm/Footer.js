import React from 'react'
import PropTypes from 'prop-types'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/lib/fa'
import styles from './Footer.scss'

const Footer = ({ step, changeStep }) => {
  if ( step === 1 ) { return null }

  if (step === 4 ) {
    return (
      <div className={styles.footer}>
        <div className='buttonContainer'>
          <div className='buttonPrimary'onClick={() => changeStep(step - 1)}>
            Back
          </div>
        </div>
        <div className='buttonContainer' onClick={() => console.log('create this mf channel baby')}>
          <div className='buttonPrimary'>
            Submit
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.footer}>
      <div className='buttonContainer'>
        <div className='buttonPrimary'onClick={() => changeStep(step - 1)}>
          Back
        </div>
      </div>
      <div className='buttonContainer' onClick={() => changeStep(step + 1)}>
        <div className='buttonPrimary'>
          Next
        </div>
      </div>
    </div>
  )
}

Footer.propTypes = {}

export default Footer
