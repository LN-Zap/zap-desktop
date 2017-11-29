import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import styles from './PeerForm.scss'

const PeerForm = ({ form, setForm, connect }) => {
  const submit = () => {
    const { pubkey, host } = form
    connect({ pubkey, host })
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
        className={styles.modal}
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

          <div className='buttonContainer' onClick={submit}>
            <div className='buttonPrimary'>
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
