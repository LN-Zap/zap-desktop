import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'
import zapLogo from 'icons/zap_logo.svg'
import styles from './Syncing.scss'


class Syncing extends Component {
  componentWillMount() {
    this.props.fetchBlockHeight()
  }

  render() {
    const { syncPercentage } = this.props

    return (
      <div className={styles.container}>
        <div className={styles.titleBar} />
        
        <div className={styles.content}>
          <header>
            <Isvg className={styles.bitcoinLogo} src={zapLogo} />
          </header>
          <section className={styles.progressContainer}>
            <h1>Syncing to the blockchain...</h1>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: isNaN(syncPercentage) ? 0 : `${syncPercentage}%` }} />
            </div>
            <h4>{isNaN(parseInt(syncPercentage)) || syncPercentage.toString().length === 0 ? '' : `${syncPercentage}%`}</h4>
          </section>
        </div>
      </div>
    )
  }
}

Syncing.propTypes = {
  fetchBlockHeight: PropTypes.func.isRequired,
  syncPercentage: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired
}

export default Syncing
