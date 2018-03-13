import React from 'react'
import PropTypes from 'prop-types'
import styles from './NewWalletSeed.scss'

const NewWalletSeed = ({ seed }) => (
  <div className={styles.container}>
    {
      seed.length > 0 ?
        seed.join(', ')
        :
        'loading'
    }
  </div>
)

NewWalletSeed.propTypes = {
  seed: PropTypes.array.isRequired
}

export default NewWalletSeed
