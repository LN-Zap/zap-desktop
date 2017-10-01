import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import styles from './PeerForm.scss'

const PeerForm = ({ form, setForm, connect }) => {
  const submit = () => {
    const { pubkey, host } = form
    connect({ pubkey, host })
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
            <label htmlFor='pubkey'>Pubkey</label>
            <input
              type='text'
              size=''
              placeholder='Public key'
              value={form.pubkey}
              onChange={event => setForm({ pubkey: event.target.value })}
              id='pubkey'
            />
          </section>
          <section className={styles.local}>
            <label htmlFor='address'>Address</label>
            <input
              type='text'
              size=''
              placeholder='Host address'
              value={form.host}
              onChange={event => setForm({ host: event.target.value })}
              id='address'
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

PeerForm.propTypes = {
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  connect: PropTypes.func.isRequired
}

export default PeerForm
