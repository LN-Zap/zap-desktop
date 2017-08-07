// @flow
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { FaUser, FaBitcoin, FaDollar } from 'react-icons/lib/fa'
import styles from './ChannelForm.scss'

class ChannelForm extends Component {
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
    
    const { form, setForm, ticker, peers, openChannel } = this.props

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
            <h1 className={styles.title}>Open a new channel</h1>
            
            <section className={styles.pubkey}>
              <label><FaUser /></label>
              <input
                type='text'
                size=''
                placeholder='Peer public key'
                value={form.node_key}
                onChange={(event) => setForm({ node_key: event.target.value })}
              />
            </section>
            <section className={styles.local}>
              <label>
                {
                  ticker.currency === 'btc' ? 
                    <FaBitcoin />
                  :
                    <FaDollar />
                }
              </label>
              <input
                type='text'
                size=''
                placeholder='Local amount'
                value={form.local_amt}
                onChange={(event) => setForm({ local_amt: event.target.value })}
              />
            </section>
            <section className={styles.push}>
              <label>
                {
                  ticker.currency === 'btc' ? 
                    <FaBitcoin />
                  :
                    <FaDollar />
                }
              </label>
              <input
                type='text'
                size=''
                placeholder='Push amount'
                value={form.push_amt}
                onChange={(event) => setForm({ push_amt: event.target.value })}
              />
            </section>

            <ul className={styles.peers}>
              <h2>Connected Peers</h2>
              {
                peers.length ?
                  peers.map(peer =>
                    <li key={peer.peer_id} className={styles.peer} onClick={() => setForm({ node_key: peer.pub_key })}>
                        <h4>{peer.address}</h4>
                        <h1>{peer.pub_key}</h1>
                    </li>
                  )
                :
                  null
              }
            </ul>

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

export default ChannelForm
