import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './LndSyncing.scss'

class LndSyncing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      facts: [
        {
          title: 'The Lightning Network',
          description: 'The Lightning Network is a second layer solution built on top of the Bitcoin block chain that attempts to increase Bitcoin\'s scalability and privacy' // eslint-disable-line
        },
        {
          title: 'Payment Channel',
          description: 'A payment channel is a class of techniques designed to allow users to make multiple Bitcoin transactions without commiting all of the transactions to the Bitcoin block chain. You can think of payment channels like tubes of money' // eslint-disable-line
        },
        {
          title: 'HTLC',
          description: 'Hashed TimeLock Contracts is a class of payments that use hashlocks and timelocks to require the receiver of a payment either acknowledge receiving the payment before a deadline or forfeit the ability to claim the payment. HTLCs are useful within the Lightning Network for routing payments across two or more payment channels' // eslint-disable-line
        },
        {
          title: 'Onion Routing',
          description: 'Onion routing is a technique for anonymous communication over a computer network. In an onion network, messages are encapsulated in layers of encryption, analogous to layers of an onion.' // eslint-disable-line
        }
      ],
      currentFact: 0
    }
  }

  componentWillMount() {
    this.props.fetchBlockHeight()
  }

  render() {
    const { fetchingBlockHeight, syncPercentage } = this.props
    const { facts, currentFact } = this.state
    const renderCurrentFact = facts[currentFact]

    return (
      <div className={styles.container}>
        <h3>zap</h3>
        <div className={styles.loading}>
          {!fetchingBlockHeight && <h4>{syncPercentage > 0 && `${syncPercentage}%`}</h4>}
          <div className={styles.spinner} />
          <h1>syncing your lightning node to the blockchain</h1>
        </div>
        <div className={styles.facts}>
          <div className={styles.fact}>
            <h2>{renderCurrentFact.title}</h2>
            <p>{renderCurrentFact.description}</p>
          </div>
          <ul>
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
