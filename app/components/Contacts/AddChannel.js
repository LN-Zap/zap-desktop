import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'

import x from 'icons/x.svg'

import styles from './AddChannel.scss'

class AddChannel extends Component {
  constructor(props) {
    super(props)
    this.searchInput = React.createRef()
  }

  componentDidMount() {
    // Focus the search input field.
    this.searchInput.current.focus()
  }

  render() {
    const {
      contactsform,
      closeContactsForm,
      openSubmitChannelForm,
      updateContactFormSearchQuery,
      updateManualFormSearchQuery,
      setNode,
      activeChannelPubkeys,
      nonActiveChannelPubkeys,
      pendingOpenChannelPubkeys,
      filteredNetworkNodes,
      loadingChannelPubkeys,
      showManualForm,
      openManualForm
    } = this.props
    const renderRightSide = node => {
      if (loadingChannelPubkeys.includes(node.pub_key)) {
        return (
          <span className={styles.inactive}>
            <div className={styles.loading}>
              <div className={styles.spinner} />
            </div>
          </span>
        )
      }

      if (activeChannelPubkeys.includes(node.pub_key)) {
        return (
          <span className={`${styles.online} ${styles.inactive}`}>
            <span>Online</span>
          </span>
        )
      }

      if (nonActiveChannelPubkeys.includes(node.pub_key)) {
        return (
          <span className={`${styles.offline} ${styles.inactive}`}>
            <span>Offline</span>
          </span>
        )
      }

      if (pendingOpenChannelPubkeys.includes(node.pub_key)) {
        return (
          <span className={`${styles.pending} ${styles.inactive}`}>
            <span>Pending</span>
          </span>
        )
      }

      if (!node.addresses.length) {
        return <span className={`${styles.private} ${styles.inactive}`}>Private</span>
      }

      return (
        <span
          className={styles.connect}
          onClick={() => {
            // set the node public key for the submit form
            setNode(node)
            // open the submit form
            openSubmitChannelForm()
          }}
        >
          Connect
        </span>
      )
    }

    const searchUpdated = search => {
      updateContactFormSearchQuery(search)

      if (search.includes('@') && search.split('@')[0].length === 66) {
        updateManualFormSearchQuery(search)
      }
    }

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <input
            type="text"
            placeholder="Search the network..."
            className={styles.searchInput}
            value={contactsform.searchQuery}
            onChange={event => searchUpdated(event.target.value)}
            ref={this.searchInput}
          />
          <span onClick={closeContactsForm} className={styles.closeIcon}>
            <Isvg src={x} />
          </span>
        </header>

        <section className={styles.nodes}>
          <ul className={styles.networkResults}>
            {filteredNetworkNodes.map(node => (
              <li key={node.pub_key}>
                <section>
                  {node.alias.length > 0 ? (
                    <h2>
                      <span>{node.alias.trim()}</span>
                      <span>
                        ({node.pub_key.substr(0, 10)}
                        ...
                        {node.pub_key.substr(node.pub_key.length - 10)})
                      </span>
                    </h2>
                  ) : (
                    <h2>
                      <span>{node.pub_key}</span>
                    </h2>
                  )}
                </section>
                <section>{renderRightSide(node)}</section>
              </li>
            ))}
          </ul>
        </section>

        {showManualForm && (
          <section className={styles.manualForm}>
            <p>
              Hm, looks like we can&apos;t see that node from here, wanna try to manually connect?
            </p>
            <div className={styles.manualConnectButton} onClick={openManualForm}>
              Connect Manually
            </div>
          </section>
        )}
      </div>
    )
  }
}

AddChannel.propTypes = {
  contactsform: PropTypes.object.isRequired,
  closeContactsForm: PropTypes.func.isRequired,
  openSubmitChannelForm: PropTypes.func.isRequired,
  updateContactFormSearchQuery: PropTypes.func.isRequired,
  updateManualFormSearchQuery: PropTypes.func.isRequired,
  setNode: PropTypes.func.isRequired,
  activeChannelPubkeys: PropTypes.array.isRequired,
  nonActiveChannelPubkeys: PropTypes.array.isRequired,
  pendingOpenChannelPubkeys: PropTypes.array.isRequired,
  filteredNetworkNodes: PropTypes.array.isRequired,
  loadingChannelPubkeys: PropTypes.array.isRequired,
  showManualForm: PropTypes.bool.isRequired,
  openManualForm: PropTypes.func.isRequired
}

export default AddChannel
