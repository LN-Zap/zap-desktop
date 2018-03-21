import React from 'react'
import PropTypes from 'prop-types'
import styles from './ReEnterSeed.scss'

const ReEnterSeed = ({ seed, seedInput, updateSeedInput, reEnterSeedChecker, renderEnterSeedHtml }) => {
  return (
    <div className={styles.container}>
      <ul className={styles.seedContainer}>
        {
          seed.map((word, index) => {
            return (
              <li>
                <section>
                  <label htmlFor={word}>{index + 1}</label>
                </section>
                <section>
                  <input
                    type='text'
                    id={word}
                    placeholder='word'
                    value={seedInput[index] ? seedInput[index].word : ''}
                    onChange={(event) => updateSeedInput({ word: event.target.value, index })}
                    className={`${styles.word} ${seedInput[index] && word === seedInput[index].word ? styles.valid : styles.invalid}`}
                  />
                </section>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

ReEnterSeed.propTypes = {
  seedInput: PropTypes.array.isRequired,
  updateSeedInput: PropTypes.func.isRequired,
  reEnterSeedChecker: PropTypes.array.isRequired
}

export default ReEnterSeed
