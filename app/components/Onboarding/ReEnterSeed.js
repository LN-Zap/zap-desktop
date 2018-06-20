import React from 'react'
import PropTypes from 'prop-types'
import styles from './ReEnterSeed.scss'

const ReEnterSeed = ({ seed, seedInput, updateSeedInput }) => (
  <div className={styles.container}>
    <ul className={styles.seedContainer}>
      {seed.map((word, index) => (
        <li key={index}>
          <section>
            <label htmlFor={word}>{index + 1}</label>
          </section>
          <section>
            <input
              type="text"
              id={word}
              placeholder="word"
              value={seedInput[index] ? seedInput[index].word : ''}
              onChange={event => updateSeedInput({ word: event.target.value, index })}
              className={`${styles.word} ${seedInput[index] && word === seedInput[index].word ? styles.valid : styles.invalid}`}
            />
          </section>
        </li>
      ))}
    </ul>
  </div>
)

ReEnterSeed.propTypes = {
  seed: PropTypes.array.isRequired,
  seedInput: PropTypes.array.isRequired,
  updateSeedInput: PropTypes.func.isRequired
}

export default ReEnterSeed
