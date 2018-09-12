import React from 'react'
import PropTypes from 'prop-types'
import styles from './RecoverForm.scss'

const RecoverForm = ({ recoverSeedInput, updateRecoverSeedInput }) => (
  <div className={styles.container}>
    <ul className={styles.seedContainer}>
      {Array(24)
        .fill('')
        .map((word, index) => (
          <li key={index}>
            <section>
              <label htmlFor={index}>{index + 1}</label>
            </section>
            <section>
              <input
                type="text"
                id={index}
                placeholder="word"
                value={recoverSeedInput[index] ? recoverSeedInput[index].word : ''}
                onChange={event => updateRecoverSeedInput({ word: event.target.value, index })}
                className={styles.word}
              />
            </section>
          </li>
        ))}
    </ul>
  </div>
)

RecoverForm.propTypes = {
  recoverSeedInput: PropTypes.array.isRequired,
  updateRecoverSeedInput: PropTypes.func.isRequired
}

export default RecoverForm
