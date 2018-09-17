import React from 'react'
import PropTypes from 'prop-types'
import styles from './ReEnterSeed.scss'

class ReEnterSeed extends React.Component {
  componentWillMount() {
    const { setReEnterSeedIndexes } = this.props
    setReEnterSeedIndexes()
  }

  render() {
    const { seed, reEnterSeedInput, updateReEnterSeedInput, seedIndexesArr } = this.props

    return (
      <div className={styles.container}>
        <ul className={styles.seedContainer}>
          {seedIndexesArr.map(index => (
            <li key={index}>
              <section>
                <label htmlFor={index}>{index}</label>
              </section>
              <section>
                <input
                  type="text"
                  id={index}
                  value={reEnterSeedInput[index] ? reEnterSeedInput[index] : ''}
                  onChange={event => updateReEnterSeedInput({ word: event.target.value, index })}
                  className={`${styles.word} ${
                    reEnterSeedInput[index] && seed[index - 1] === reEnterSeedInput[index]
                      ? styles.valid
                      : styles.invalid
                  }`}
                />
              </section>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

ReEnterSeed.propTypes = {
  seed: PropTypes.array.isRequired,
  reEnterSeedInput: PropTypes.object.isRequired,
  updateReEnterSeedInput: PropTypes.func.isRequired,
  setReEnterSeedIndexes: PropTypes.func.isRequired,
  seedIndexesArr: PropTypes.array.isRequired
}

export default ReEnterSeed
