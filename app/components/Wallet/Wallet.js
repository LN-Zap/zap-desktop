import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FaQrcode } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'
import { btc } from 'utils'
import skinnyBitcoinIcon from 'icons/skinny_bitcoin.svg'
import ReceiveModal from './ReceiveModal'

import styles from './Wallet.scss'

class Wallet extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false,
      qrCodeType: 1
    }
  }

  render() {
    const {
      balance,
      address,
      info,
      newAddress
    } = this.props

    const { modalOpen, qrCodeType } = this.state

    const changeQrCode = () => {
      const qrCodeNum = this.state.qrCodeType === 1 ? 2 : 1

      this.setState({ qrCodeType: qrCodeNum })
    }

    return (
      <div className={styles.wallet}>
        {
          (
            modalOpen &&
            <ReceiveModal
              isOpen={modalOpen}
              hideActivityModal={() => this.setState({ modalOpen: false })}
              pubkey={info.data.identity_pubkey}
              address={address}
              newAddress={newAddress}
              qrCodeType={qrCodeType}
              changeQrCode={changeQrCode}
            />
          )
        }
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.leftContent}>
              <Isvg className={styles.bitcoinLogo} src={skinnyBitcoinIcon} />
              <div className={styles.details}>
                <h1>{btc.satoshisToBtc(parseFloat(balance.walletBalance) + parseFloat(balance.channelBalance))} BTC</h1>
                <span>{btc.satoshisToBtc(balance.walletBalance)} available</span>
                <span>{btc.satoshisToBtc(balance.channelBalance)} in channels</span>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.rightContent}>
              <div className='buttonPrimary' onClick={() => this.setState({ modalOpen: true })}>
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

Wallet.propTypes = {
  balance: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
  newAddress: PropTypes.func.isRequired
}

export default Wallet
