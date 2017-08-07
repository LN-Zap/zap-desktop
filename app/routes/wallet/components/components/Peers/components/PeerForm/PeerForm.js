// @flow
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styles from './PeerForm.scss'

class PeerForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      pubkey: '02ef6248210e27b0f0df4d11d876e63f56e04bcb0054d0d8b6ba6a1a3e90dc56e1',
      host: 'lnd-testnet-2.mably.com'
    }
  }

  render() {
    const submit = () => {
      const { pubkey, host } = this.state
      this.props.connect({ pubkey, host }).then(success => {
        if (success.data) { setForm({ isOpen: false }) }
      })
    }

    const customStyles = {
      overlay: {
        cursor: 'pointer',
        overflowY: 'auto'
      },
      content : {
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
    const { pubkey, host } = this.state
    return (
      <div>
        <ReactModal
          isOpen={form.isOpen}
          contentLabel="No Overlay Click Modal"
          ariaHideApp={true}
          shouldCloseOnOverlayClick={true}
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
                onChange={(event) => setForm({ pubkey: event.target.value })}
              />
            </section>
            <section className={styles.local}>
              <label>Address</label>
              <input
                type='text'
                size=''
                placeholder='Host address'
                value={form.host}
                onChange={(event) => setForm({ host: event.target.value })}
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
