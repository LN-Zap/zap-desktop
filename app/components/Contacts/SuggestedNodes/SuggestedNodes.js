import React from 'react'
import PropTypes from 'prop-types'
import styles from './SuggestedNodes.scss'

const SuggestedNodes = ({
  suggestedNodesLoading,
  suggestedNodes,
  setNode,
  openSubmitChannelForm
}) => {
  const nodeClicked = n => {
    // set the node public key for the submit form
    setNode({ pub_key: n.pubkey, addresses: [{ addr: n.host }] })
    // open the submit form
    openSubmitChannelForm()
  }
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
        Hmmm, looks like you don&apos;t have any channels yet. Here are some suggested nodes to open
        a channel with to get started
      </header>

      <ul className={styles.suggestedNodes}>
        {suggestedNodes.map(node => (
          <li key={node.pubkey}>
            <section>
              <span>{node.nickname}</span>
              <span>{`${node.pubkey.substring(0, 30)}...`}</span>
            </section>
            <section>
              <span onClick={() => nodeClicked(node)}>Connect</span>
            </section>
          </li>
        ))}
      </ul>
    </div>
  )
}

SuggestedNodes.propTypes = {
  suggestedNodesLoading: PropTypes.bool.isRequired,
  suggestedNodes: PropTypes.array.isRequired,
  setNode: PropTypes.func.isRequired,
  openSubmitChannelForm: PropTypes.func.isRequired
}

export default SuggestedNodes
