import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FaQrcode } from 'react-icons/lib/fa'
import CryptoIcon from 'components/CryptoIcon'
import { btc, usd } from 'utils'
import ReceiveModal from './ReceiveModal'
import styles from './Wallet.scss'

class Wallet extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false
    }
  }

  render() {
    const {
      ticker,
      currentTicker,
      balance,
      address,
      info,
      showModal
    } = this.props

    const { modalOpen } = this.state

    return (
      <div className={styles.wallet}>
        {
          (modalOpen && 
            <ReceiveModal
              isOpen={modalOpen}
              hideActivityModal={() => this.setState({ modalOpen: false })}
              pubkey={info.data.identity_pubkey}
              address={address}
            />)
        }
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.leftContent}>
              <CryptoIcon currency={ticker.crypto} />
              <div className={styles.details}>
                <h1>{btc.satoshisToBtc(parseFloat(balance.walletBalance) + parseFloat(balance.channelBalance))} BTC</h1>
                <span>{btc.satoshisToBtc(balance.walletBalance)} available</span>
                <span>{btc.satoshisToBtc(balance.channelBalance)} in channels</span>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.rightContent}>
              <div onClick={() => this.setState({ modalOpen: true })}>
                <FaQrcode />
                Address
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
// const Wallet = ({ ticker, currentTicker, balance, address, info, showModal }) => {
//   const copyOnClick = data => {
//     copy(data)
//     showNotification('Noice', 'Successfully copied to clipboard')
//   }

//   return (
//   )
// }

Wallet.propTypes = {
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired
}

export default Wallet
