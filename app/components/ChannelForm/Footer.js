import React from 'react'
import PropTypes from 'prop-types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/lib/fa'
import styles from './Footer.scss'

const Footer = ({ step }) => {
  if ( step === 1 ) { return null }

  return (
    <div className={styles.footer}>
      <div className='buttonContainer circleContainer'>
        <div className='buttonPrimary circle'>
          <FaArrowLeft />
        </div>
      </div>
      <div className='buttonContainer circleContainer'>
        <div className='buttonPrimary circle'>
          <FaArrowRight />
        </div>
      </div>
    </div>
  )
}

Footer.propTypes = {}

export default Footer
