import React from 'react'
import PropTypes from 'prop-types'
import { FaCircle } from 'react-icons/lib/fa'
import styles from './Contact.scss'

const LoadingContact = ({ pubkey, isClosing }) => (
  <li className={`${styles.friend} ${styles.loading}`}>
    <section className={styles.info}>
      <p>
        <FaCircle style={{ verticalAlign: 'top' }} />
        <span>
          {
            isClosing ?
              'Closing'
              :
              'Loading'
          }
        </span>
      </p>
      <h2>{pubkey}</h2>
    </section>
    <section className={styles.limits}>
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    </section>
  </li>
)

LoadingContact.propTypes = {
  pubkey: PropTypes.string.isRequired,
  isClosing: PropTypes.bool.isRequired
}

export default LoadingContact
