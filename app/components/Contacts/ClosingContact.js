import { shell } from 'electron'
import React from 'react'
import PropTypes from 'prop-types'
import { FaCircle } from 'react-icons/lib/fa'
import { btc } from 'utils'
import styles from './Contact.scss'

const ClosingContact = ({ channel }) => (
  <li className={styles.friend}>
    <section className={styles.info}>
      <p className={styles.closing}>
        <FaCircle style={{ verticalAlign: 'top' }} />
        <span>
          Removing
          <i onClick={() => shell.openExternal(`${'https://testnet.smartbit.com.au'}/tx/${channel.closing_txid}`)}>
            (Details)
          </i>
        </span>
      </p>
      <h2>{channel.channel.remote_node_pub}</h2>
    </section>
    <section className={styles.limits}>
      <div>
        <h4>Can Pay</h4>
        <p>{btc.satoshisToBtc(channel.channel.local_balance)}BTC</p>
      </div>
      <div>
        <h4>Can Receive</h4>
        <p>{btc.satoshisToBtc(channel.channel.remote_balance)}BTC</p>
      </div>
    </section>
  </li>
)

ClosingContact.propTypes = {

}

export default ClosingContact
