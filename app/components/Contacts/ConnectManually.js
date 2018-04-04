import React from 'react'
import PropTypes from 'prop-types'

import { FaAngleDown } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'
import x from 'icons/x.svg'

import styles from './ConnectManually.scss'

class ConnectManually extends React.Component {
  render() {
    const {
      manualFormOpen,
      manualSearchQuery,

      closeManualForm,
      updateManualFormSearchQuery
    } = this.props

    console.log('props: ', this.props)

    return (
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Connect Manually</h1>
          <p>Please enter the peer's pubkey@host</p>
        </header>

        <section className={styles.peer}>
          <div className={styles.input}>
            <input
              type='text'
              placeholder='pubkey@host'
              value={manualSearchQuery}
              onChange={event => updateManualFormSearchQuery(event.target.value)}
            />
          </div>
        </section>
      </div>
    )
  }
}

ConnectManually.propTypes = {}

export default ConnectManually
