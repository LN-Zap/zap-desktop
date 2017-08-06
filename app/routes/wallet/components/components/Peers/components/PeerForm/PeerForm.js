// @flow
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styles from './PeerForm.scss'

class PeerForm extends Component {
  render() {
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
    
    const { form, setForm } = this.props
    return (
      <div>
        <ReactModal
          isOpen={form.isOpen}
          contentLabel="No Overlay Click Modal"
          ariaHideApp={true}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => setForm(false)}
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
              />
            </section>
            <section className={styles.local}>
              <label>Address</label>
              <input
                type='text'
                size=''
                placeholder='Host address'
              />
            </section>
            
            <div className={styles.buttonGroup}>
              <div className={styles.button}>
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