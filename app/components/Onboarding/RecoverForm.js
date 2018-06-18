import React from 'react'
import PropTypes from 'prop-types'
import styles from './RecoverForm.scss'

const RecoverForm = ({ seedInput, updateSeedInput }) => (
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
                value={seedInput[index] ? seedInput[index].word : ''}
                onChange={event => updateSeedInput({ word: event.target.value, index })}
                className={styles.word}
              />
            </section>
          </li>
        ))}
    </ul>
  </div>
)

RecoverForm.propTypes = {
  seedInput: PropTypes.array.isRequired,
  updateSeedInput: PropTypes.func.isRequired,
}

export default RecoverForm
