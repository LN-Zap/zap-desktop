import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FaAngleDown } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'
import { btc } from 'utils'
import bitcoinIcon from 'icons/bitcoin.svg'
import zapLogo from 'icons/zap_logo.svg'
import qrCode from 'icons/qrcode.svg'
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
      newAddress,
      currentTicker,
      openPayForm,
      openRequestForm
    } = this.props

    const { modalOpen, qrCodeType } = this.state
    const usdAmount = btc.satoshisToUsd((parseInt(balance.walletBalance, 10) + parseInt(balance.channelBalance, 10)), currentTicker.price_usd)

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
          <header className={styles.header}>
            <section className={styles.logo}>
              <Isvg className={styles.bitcoinLogo} src={zapLogo} />
            </section>

            <section className={styles.user}>
              <div>
                <span>{info.data.alias}</span>
                <FaAngleDown />
              </div>
            </section>
          </header>

          <div className={styles.left}>
            <div className={styles.leftContent}>
              <Isvg className={styles.bitcoinLogo} src={bitcoinIcon} />
              <div className={styles.details}>
                <h1>
                  <span>
                    {btc.satoshisToBtc(parseFloat(balance.walletBalance) + parseFloat(balance.channelBalance))}BTC
                  </span>
                  <span onClick={() => this.setState({ modalOpen: true })}>
                    <Isvg className={styles.bitcoinLogo} src={qrCode} />
                  </span>
                </h1>
                <span className={styles.usdValue}>≈ ${usdAmount ? usdAmount.toLocaleString() : ''}</span>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.rightContent}>
              <div className={styles.pay} onClick={openPayForm}>Pay</div>
              <div className={styles.request} onClick={openRequestForm}>Request</div>
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
  newAddress: PropTypes.func.isRequired,
  currentTicker: PropTypes.object.isRequired,
  openPayForm: PropTypes.func.isRequired,
  openRequestForm: PropTypes.func.isRequired
}

export default Wallet
