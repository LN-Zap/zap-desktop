import React from 'react'
import PropTypes from 'prop-types'
import styles from './NewWalletSeed.scss'

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
  </div>
)

NewWalletSeed.propTypes = {
  seed: PropTypes.array.isRequired
}

export default NewWalletSeed
