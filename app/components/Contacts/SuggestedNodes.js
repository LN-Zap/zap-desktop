import React from 'react'
import PropTypes from 'prop-types'
import styles from './SuggestedNodes.scss'

const SuggestedNodes = ({ suggestedNodesLoading, suggestedNodes }) => {
  if (suggestedNodesLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <span className={styles.loading}>
          <i className={`${styles.spinner} ${styles.closing}`} />
        </span>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header>
        Hmmm, looks like you don't have any channels yet. Here are some suggested nodes to open a channel with to get started
      </header>
      
      <ul className={styles.suggestedNodes}>
        {
          suggestedNodes.map(node => (
              <li key={node.pubkey}>
                <section>
                  <span>{node.nickname}</span>
                  <span>{`${node.pubkey.substring(0, 30)}...`}</span>
                </section>
                <section>
                  <span>Connect</span>
                </section>
              </li>
            )
          )
        }
      </ul>
    </div>
  )
}

SuggestedNodes.propTypes = {
  suggestedNodesLoading: PropTypes.bool.isRequired,
  suggestedNodes: PropTypes.array.isRequired
}

export default SuggestedNodes
