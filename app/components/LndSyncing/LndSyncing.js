import React, { Component } from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import { showNotification } from 'notifications'
import { FaCopy } from 'react-icons/lib/fa'
import styles from './LndSyncing.scss'


class LndSyncing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      facts: [
        {
          title: 'The Lightning Network',
          description: 'The Lightning Network is a second layer solution built on top of the Bitcoin block chain that attempts to increase Bitcoin\'s scalability and privacy' // eslint-disable-line max-len
        },
        {
          title: 'Payment Channel',
          description: 'A payment channel is a class of techniques designed to allow users to make multiple Bitcoin transactions without commiting all of the transactions to the Bitcoin block chain. You can think of payment channels like tubes of money' // eslint-disable-line max-len
        },
        {
          title: 'HTLC',
          description: 'Hashed TimeLock Contracts is a class of payments that use hashlocks and timelocks to require the receiver of a payment either acknowledge receiving the payment before a deadline or forfeit the ability to claim the payment. HTLCs are useful within the Lightning Network for routing payments across two or more payment channels' // eslint-disable-line max-len
        },
        {
          title: 'Onion Routing',
          description: 'Onion routing is a technique for anonymous communication over a computer network. In an onion network, messages are encapsulated in layers of encryption, analogous to layers of an onion.' // eslint-disable-line max-len
        }
      ],
      currentFact: 0
    }
  }

  componentWillMount() {
    this.props.fetchBlockHeight()
  }

  componentDidUpdate(prevProps) {
    const { grpcStarted, newAddress } = this.props

    if (!prevProps.grpcStarted && grpcStarted) {
      newAddress('np2wkh')
    }
  }

  render() {
    const { syncPercentage, address: { addressLoading, address } } = this.props
    const { facts, currentFact } = this.state
    const renderCurrentFact = facts[currentFact]

    const copyOnClick = () => {
      if (!address || !address.length) { return }

      copy(address)
      showNotification('Noice', 'Successfully copied to clipboard')
    }

    return (
      <div className={styles.container}>
        <header>
          <section>
            <h3>zap</h3>
          </section>
          <section className={`${styles.loading} hint--left`} data-hint='Syncing your Lightning Network node to the blockchain'>
            <h4>{syncPercentage.toString().length > 0 && `${syncPercentage}%`}</h4>
            <div className={styles.spinner} />
          </section>
        </header>

        <div className={styles.facts}>
          <div className={styles.fact}>
            <h2>{renderCurrentFact.title}</h2>
            <p>{renderCurrentFact.description}</p>
          </div>
          <ul className={styles.factButtons}>
            {
              facts.map((fact, index) => (
                <li
                  className={`${styles.factButton} ${currentFact === index && styles.active}`}
                  key={index}
                  onClick={() => this.setState({ currentFact: index })}
                />
              ))
            }
          </ul>
        </div>

        <div className={styles.footer}>
          <section>
            <h2>Fund your Zap wallet</h2>
            <p>Deposit to your wallet while your node is syncing so autopilot can start working magic for you</p>
          </section>
          <section>
            <div className={styles.address}>
              <span>
                {
                  addressLoading ?
                    'Loading...'
                    :
                    address
                }
              </span>
              <span className='hint--left' data-hint='Copy Address' onClick={copyOnClick}>
                <FaCopy />
              </span>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

LndSyncing.propTypes = {
  newAddress: PropTypes.func.isRequired,
  fetchBlockHeight: PropTypes.func.isRequired,
  syncPercentage: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  address: PropTypes.object.isRequired,
  grpcStarted: PropTypes.bool.isRequired
}

export default LndSyncing
