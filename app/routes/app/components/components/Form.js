// @flow
import React, { Component } from 'react'
import { FaDollar, FaBitcoin } from 'react-icons/lib/fa'
import { MdArrowBack, MdClose } from 'react-icons/lib/md'
import styles from './Form.scss'

class Form extends Component {
  componentWillMount() {
    this.props.fetchPeers()
  }

  render() {
    const { 
      setAmount,
      setMessage,
      setPubkey,
      payment: { amount, message, pubkey },
      peers: { peers },
      ticker: { currency },
      isOpen,
      close
    } = this.props

    return (
      <div className={`${styles.formContainer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.container}>
          <div className={styles.esc} onClick={close}>
            <MdClose />
          </div>
          <div className={styles.content}>
            <section className={styles.amountContainer}>
              <label>
                {
                  currency === 'btc' ?
                    <FaBitcoin />
                  :
                    <FaDollar />
                }
              </label>
              <input
                type='text'
                size=''
                style={{ width: `${(amount.length * 20) + 10}%`, fontSize: `${190 - (amount.length ** 2)}px` }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </section>
            <section className={styles.inputContainer}>
              <label>For:</label>
              <input
                type='text'
                placeholder='Dinner, Rent, etc'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </section>
            <section className={styles.inputContainer}>
              <label>To:</label>
              <input
                type='text'
                placeholder='Public key'
                value={pubkey}
                onChange={(e) => setPubkey(e.target.value)}
              />
            </section>
            <section className={styles.peersContainer}>
              {
                peers.length ? 
                  <ul className={styles.peers}>
                    <h4>Connected Peers</h4>
                    {
                      peers.map(peer => {
                        return(
                          <li key={peer.pub_key} className={styles.peer} onClick={() => setPubkey(peer.pub_key)}>
                            <p className={styles.address}>{peer.address}</p>
                            <p className={styles.pubkey}>{peer.pub_key}</p>
                            <MdArrowBack />
                          </li>
                        )
                      })
                    }
                  </ul>
                :
                  null
              }
            </section>
            <section className={styles.buttonGroup}>
              <div className={styles.button}>Pay</div>
              <div className={styles.button}>Request</div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

Form.propTypes = {}

export default Form