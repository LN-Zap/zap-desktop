import React from 'react'
import PropTypes from 'prop-types'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/lib/fa'
import styles from './Footer.scss'

const Footer = ({ step, changeStep }) => {
  if ( step === 1 ) { return null }

  if (step === 4 ) {
    return (
      <div className={styles.footer}>
        <div className='buttonContainer circleContainer'>
          <div className='buttonPrimary circle'onClick={() => changeStep(step - 1)}>
            <FaArrowLeft />
          </div>
        </div>
        <div className='buttonContainer circleContainer' onClick={() => console.log('create this mf channel baby')}>
          <div className='buttonPrimary circle'>
            <FaCheck />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.footer}>
      <div className='buttonContainer circleContainer'>
        <div className='buttonPrimary circle'onClick={() => changeStep(step - 1)}>
          <FaArrowLeft />
        </div>
      </div>
      <div className='buttonContainer circleContainer' onClick={() => changeStep(step + 1)}>
        <div className='buttonPrimary circle'>
          <FaArrowRight />
        </div>
      </div>
    </div>
  )
}

Footer.propTypes = {}

export default Footer
