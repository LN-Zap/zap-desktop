import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import { MdClose } from 'react-icons/lib/md'
import { FaCircle } from 'react-icons/lib/fa'
import styles from './ContactsForm.scss'

const ContactsForm = ({
  contactsform,
  closeContactsForm,
  updateContactFormSearchQuery,
  openChannel,

  activeChannelPubkeys,
  nonActiveChannelPubkeys,
  pendingOpenChannelPubkeys,
  filteredNetworkNodes
}) => {
  const renderRightSide = (node) => {
    if (activeChannelPubkeys.includes(node.pub_key)) {
      return (
        <span className={`${styles.online} ${styles.inactive}`}>
          <FaCircle style={{ verticalAlign: 'top' }} /> <span>Online</span>
        </span>
      )
    }

    if (nonActiveChannelPubkeys.includes(node.pub_key)) {
      return (
        <span className={`${styles.offline} ${styles.inactive}`}>
          <FaCircle style={{ verticalAlign: 'top' }} /> <span>Offline</span>
        </span>
      )
    }

    if (pendingOpenChannelPubkeys.includes(node.pub_key)) {
      return (
        <span className={`${styles.pending} ${styles.inactive}`}>
          <FaCircle style={{ verticalAlign: 'top' }} /> <span>Pending</span>
        </span>
      )
    }

    if (!node.addresses.length) {
      return (
        <span className={`${styles.private} ${styles.inactive}`}>
          Private
        </span>
      )
    }

    return (
      <span
        className={`${styles.connect} hint--left`}
        data-hint='Connect with 0.1 BTC'
        onClick={() => openChannel({ pubkey: node.pub_key, host: node.addresses[0].addr, local_amt: 0.1 })}
      >
        Connect
      </span>
    )
  }

  return (
    <div>
      <ReactModal
        isOpen={contactsform.isOpen}
        contentLabel='No Overlay Click Modal'
        ariaHideApp
        shouldCloseOnOverlayClick
        onRequestClose={() => closeContactsForm}
        parentSelector={() => document.body}
        className={styles.modal}
      >
        <header>
          <div>
            <h1>Add Contact</h1>
          </div>
          <div onClick={closeContactsForm} className={styles.modalClose}>
            <MdClose />
          </div>
        </header>

        <div className={styles.form} onKeyPress={event => event.charCode === 13 && console.log('gaaaang')}>
          <div className={styles.search}>
            <input
              type='text'
              placeholder='Find contact by alias or pubkey'
              className={styles.searchInput}
              value={contactsform.searchQuery}
              onChange={event => updateContactFormSearchQuery(event.target.value)}
              autoFocus
            />
          </div>

          <ul className={styles.networkResults}>
            {
              contactsform.searchQuery.length > 0 && filteredNetworkNodes.map(node => {
                return (
                  <li key={node.pub_key}>
                    <section>
                      {
                        node.alias.length > 0 ?  
                          <h2>
                            <span>{node.alias.trim()}</span>
                            <span>({node.pub_key.substr(0, 10)}...{node.pub_key.substr(node.pub_key.length - 10)})</span>
                          </h2>
                          :
                          <h2>
                            <span>{node.pub_key}</span>
                          </h2>
                      }
                    </section>
                    <section>
                      {renderRightSide(node)}
                    </section>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <footer className={styles.footer}>
          <div>
            <span className={styles.amount}>
              0.1
            </span>
            <span className={styles.caption}>
              BTC per contact
            </span>
          </div>
        </footer>
      </ReactModal>
    </div>
  )
}

ContactsForm.propTypes = {
  
}

export default ContactsForm
