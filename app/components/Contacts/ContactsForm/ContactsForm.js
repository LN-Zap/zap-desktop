import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import MdClose from 'react-icons/lib/md/close'
import FaCircle from 'react-icons/lib/fa/circle'
import FaQuestionCircle from 'react-icons/lib/fa/question-circle'
import styles from './ContactsForm.scss'

class ContactsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false
    }
  }

  render() {
    const {
      contactsform,
      contactsform: { showErrors },
      closeContactsForm,
      updateContactFormSearchQuery,
      updateManualFormSearchQuery,
      updateContactCapacity,
      openChannel,
      updateManualFormErrors,
      activeChannelPubkeys,
      nonActiveChannelPubkeys,
      pendingOpenChannelPubkeys,
      filteredNetworkNodes,
      loadingChannelPubkeys,
      showManualForm,
      manualFormIsValid
    } = this.props

    const { editing } = this.state

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
        return <span className={`${styles.private} ${styles.inactive}`}>Private</span>
      }

      return (
        <span
          className={`${styles.connect} hint--left`}
          data-hint={`Connect with ${contactsform.contactCapacity} BTC`}
          onClick={() =>
            openChannel({
              pubkey: node.pub_key,
              host: node.addresses[0].addr,
              local_amt: contactsform.contactCapacity
            })
          }
        >
          Connect
        </span>
      )
    }

    const inputClicked = () => {
      if (editing) {
        return
      }

      this.setState({ editing: true })
    }

    const manualFormSubmit = () => {
      if (!manualFormIsValid.isValid) {
        updateManualFormErrors(manualFormIsValid.errors)
        updateManualFormSearchQuery('')
        return
      }
      // clear any existing errors

      updateManualFormErrors({ manualInput: null })
      const [pubkey, host] =
        contactsform.manualSearchQuery && contactsform.manualSearchQuery.split('@')

      openChannel({ pubkey, host, local_amt: contactsform.contactCapacity })

      updateManualFormSearchQuery('')
    }

    const searchUpdated = search => {
      updateContactFormSearchQuery(search)

      if (search.includes('@') && search.split('@')[0].length === 66) {
        updateManualFormSearchQuery(search)
      }
    }

    return (
      <div>
        <ReactModal
          isOpen={contactsform.isOpen}
          contentLabel="No Overlay Click Modal"
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

          <div className={styles.form}>
            <div className={styles.search}>
              <input
                type="text"
                placeholder="Find contact by alias or pubkey"
                className={styles.searchInput}
                value={contactsform.searchQuery}
                onChange={event => searchUpdated(event.target.value)}
              />
            </div>

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
          </div>

          {showManualForm && (
            <div className={styles.manualForm}>
              <h2>
                Hm, looks like we can’t see that contact from here. Want to try and manually
                connect?
              </h2>
              <section>
                <input
                  type="text"
                  placeholder="pubkey@host"
                  value={contactsform.manualSearchQuery}
                  onChange={event => updateManualFormSearchQuery(event.target.value)}
                />
                <div className={styles.submit} onClick={manualFormSubmit}>
                  Submit
                </div>

                {loadingChannelPubkeys.length > 0 && (
                  <div className={styles.manualFormSpinner}>
                    <div className={styles.loading}>
                      <div className={styles.spinner} />
                    </div>
                  </div>
                )}
              </section>

              <section
                className={`${styles.errorMessage} ${
                  showErrors.manualInput ? styles.active : undefined
                }`}
              >
                {showErrors.manualInput && (
                  <span>{manualFormIsValid && manualFormIsValid.errors.manualInput}</span>
                )}
              </section>
            </div>
          )}

          <footer className={styles.footer}>
            <div>
              <span>Use</span>
              <span className={styles.amount}>
                <input
                  type="text"
                  value={contactsform.contactCapacity}
                  onChange={event => updateContactCapacity(event.target.value)}
                  onClick={inputClicked}
                  onKeyPress={event => event.charCode === 13 && this.setState({ editing: false })}
                  readOnly={!editing}
                  style={{
                    width: `${editing ? 20 : contactsform.contactCapacity.toString().length + 1}%`
                  }}
                />
              </span>
              <span className={styles.caption}>
                BTC per contact
                <i
                  data-hint="You aren't spending anything, just moving money onto the Lightning Network"
                  className="hint--top"
                >
                  <FaQuestionCircle style={{ verticalAlign: 'top' }} />
                </i>
              </span>
            </div>
          </footer>
        </ReactModal>
      </div>
    )
  }
}

ContactsForm.propTypes = {
  contactsform: PropTypes.object.isRequired,
  closeContactsForm: PropTypes.func.isRequired,
  updateContactFormSearchQuery: PropTypes.func.isRequired,
  updateManualFormSearchQuery: PropTypes.func.isRequired,
  manualFormIsValid: PropTypes.shape({
    errors: PropTypes.object,
    isValid: PropTypes.bool
  }).isRequired,
  updateContactCapacity: PropTypes.func.isRequired,
  updateManualFormErrors: PropTypes.func.isRequired,
  openChannel: PropTypes.func.isRequired,
  activeChannelPubkeys: PropTypes.array.isRequired,
  nonActiveChannelPubkeys: PropTypes.array.isRequired,
  pendingOpenChannelPubkeys: PropTypes.array.isRequired,
  filteredNetworkNodes: PropTypes.array.isRequired,
  loadingChannelPubkeys: PropTypes.array.isRequired,
  showManualForm: PropTypes.bool.isRequired
}

export default ContactsForm
