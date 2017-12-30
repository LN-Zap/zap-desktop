import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import { FaClose } from 'react-icons/lib/fa'
import Loader from 'react-icons/lib/md/autorenew'
import styles from './PeerForm.scss'

const PeerForm = ({ form, setForm, connect, connecting }) => {
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
        <div onClick={() => setForm({ isOpen: false })} className={styles.modalClose}>
          <FaClose />
        </div>

        {connecting &&
          <div className={styles.loading}>
            <Loader className={styles.loader} />
          </div>
        }
        <div className={styles.form} onKeyPress={event => event.charCode === 13 && submit()}>
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
  connect: PropTypes.func.isRequired,
  connecting: PropTypes.bool.isRequired
}

export default PeerForm
