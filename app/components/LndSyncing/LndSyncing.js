import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
    const { fetchBlockHeight, newAddress } = this.props
    
    fetchBlockHeight()
    newAddress('np2wkh')
  }

  render() {
    const { newAddress, fetchingBlockHeight, syncPercentage, address: { address } } = this.props
    const { facts, currentFact } = this.state
    const renderCurrentFact = facts[currentFact]

    return (
      <div className={styles.container}>
        <header>
          <section>
            <h3>zap</h3>
          </section>
          <section className={styles.loading}>
            <h4>{syncPercentage}%</h4>
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
              <span>{address}</span>
              <span className='hint--left' data-hint='Copy Address'>
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
  fetchBlockHeight: PropTypes.func.isRequired,
  fetchingBlockHeight: PropTypes.bool.isRequired,
  syncPercentage: PropTypes.number.isRequired
}

export default LndSyncing