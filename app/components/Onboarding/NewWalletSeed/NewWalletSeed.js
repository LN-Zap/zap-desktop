import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { WarningLabel } from 'components/UI'
import styles from './NewWalletSeed.scss'
import messages from './messages'

const NewWalletSeed = ({ seed }) => (
  <div className={styles.container}>
    <ul className={styles.seedContainer}>
      {seed.map((word, index) => (
        <li key={index}>
          <section>
            <label htmlFor={word}>{index + 1}</label>
          </section>
          <section>
            <span>{word}</span>
          </section>
        </li>
      ))}
    </ul>
    <WarningLabel message={<FormattedMessage {...messages.save_seed_help} />} />
  </div>
)

NewWalletSeed.propTypes = {
  seed: PropTypes.array.isRequired
}

export default NewWalletSeed
