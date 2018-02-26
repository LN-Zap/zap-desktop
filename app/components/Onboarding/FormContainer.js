import React from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'

import { FaAngleLeft, FaAngleRight } from 'react-icons/lib/fa'

import zapLogo from 'icons/zap_logo.svg'
import styles from './FormContainer.scss'

const FormContainer = ({
  title,
  description,
  back,
  next,
  children
}) => (
  <div className={styles.container}>
    <div className={styles.titleBar} />

    <header className={styles.header}>
      <section>
        <Isvg src={zapLogo} />
      </section>
      <section />
    </header>

    <div className={styles.info}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>

    <div className={styles.content}>
      {children}
    </div>

    <footer className={styles.footer}>
      <div className={styles.buttonsContainer}>
        <section>
          {
            back && <div onClick={back}><FaAngleLeft style={{ verticalAlign: 'top' }} /> Back</div>
          }
        </section>
        <section>
          {
            next && <div onClick={next}>Next <FaAngleRight style={{ verticalAlign: 'top' }} /></div>
          }
        </section>
      </div>
    </footer>
  </div>
)


FormContainer.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,

  back: PropTypes.func,
  next: PropTypes.func,

  children: PropTypes.object.isRequired
}

export default FormContainer
