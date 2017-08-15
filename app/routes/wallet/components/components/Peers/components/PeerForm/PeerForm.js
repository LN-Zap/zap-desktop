// @flow
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styles from './PeerForm.scss'

class PeerForm extends Component {
  render() {
    const submit = () => {
      const { form: { pubkey, host } } = this.props

      this.props.connect({ pubkey, host }).then((success) => {
        if (success.data) { setForm({ isOpen: false }) }
      })
    }

    const customStyles = {
      overlay: {
        cursor: 'pointer',
        overflowY: 'auto'
      },
      content: {
        top: 'auto',
        left: '20%',
        right: '0',
        bottom: 'auto',
        width: '40%',
        margin: '50px auto',
        padding: '40px'
      }
    }

    const { form, setForm, connect } = this.props
    return (
      <div>
        <ReactModal
          isOpen={form.isOpen}
          contentLabel='No Overlay Click Modal'
          ariaHideApp
          shouldCloseOnOverlayClick
          onRequestClose={() => setForm({ isOpen: false })}
          parentSelector={() => document.body}
          style={customStyles}
        >
          <div className={styles.form}>
            <h1 className={styles.title}>Connect to a peer</h1>

            <section className={styles.pubkey}>
              <label>Pubkey</label>
              <input
                type='text'
                size=''
                placeholder='Public key'
                value={form.pubkey}
                onChange={event => setForm({ pubkey: event.target.value })}
              />
            </section>
            <section className={styles.local}>
              <label>Address</label>
              <input
                type='text'
                size=''
                placeholder='Host address'
                value={form.host}
                onChange={event => setForm({ host: event.target.value })}
              />
            </section>

            <div className={styles.buttonGroup}>
              <div className={styles.button} onClick={submit}>
                Submit
              </div>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}

export default PeerForm
