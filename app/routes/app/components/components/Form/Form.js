import React from 'react'
import PropTypes from 'prop-types'
import { MdClose } from 'react-icons/lib/md'
import Pay from './components/Pay'
import Request from './components/Request'
import CurrencyIcon from '../../../../../components/CurrencyIcon'
import { btc } from '../../../../../utils'
import styles from './Form.scss'

const Form = ({
  form: { formType, paymentType, amount, onchainAmount, message, payment_request },
  payment: { sendingPayment },
  setPaymentType,
  setAmount,
  setOnchainAmount,
  setMessage,
  setPaymentRequest,
  ticker: { currency, crypto },
  isOpen,
  close,
  createInvoice,
  payInvoice,
  sendCoins,
  fetchInvoice,
  formInvoice,
  currentTicker,
  isOnchain,
  isLn
}) => {

  return (
    <div className={`${styles.formContainer} ${isOpen ? styles.open : ''}`}>
      <div className={styles.container}>
        <div className={styles.esc} onClick={close}>
          <MdClose />
        </div>
        <div className={styles.content}>
          {
            formType === 'pay' ?
              <Pay
                sendingPayment={sendingPayment}
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                invoiceAmount={formInvoice.amount}
                onchainAmount={onchainAmount}
                setOnchainAmount={setOnchainAmount}
                amount={formInvoice.amount}
                payment_request={payment_request}
                setPaymentRequest={setPaymentRequest}
                fetchInvoice={fetchInvoice}
                payInvoice={payInvoice}
                sendCoins={sendCoins}
                currentTicker={currentTicker}
                currency={currency}
                crypto={crypto}
                close={close}
                isOnchain={isOnchain}
                isLn={isLn}
                currency={currency}
                crypto={crypto}
                close={close}
              />
              :
              <Request
                amount={amount}
                setAmount={setAmount}
                payment_request={payment_request}
                setMessage={setMessage}
                createInvoice={createInvoice}
                message={message}
                currentTicker={currentTicker}
                currency={currency}
                crypto={crypto}
                close={close}
              />
            
          }
        </div>
      </div>
    </div>
  )
}

Form.propTypes = {
  payment: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  setPaymentType: PropTypes.func.isRequired,
  ticker: PropTypes.object.isRequired,
  setAmount: PropTypes.func.isRequired,
  setOnchainAmount: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  setPaymentRequest: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  createInvoice: PropTypes.func.isRequired,
  payInvoice: PropTypes.func.isRequired,
  sendCoins: PropTypes.func.isRequired,
  fetchInvoice: PropTypes.func.isRequired,
  formInvoice: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  isOnchain: PropTypes.bool.isRequired,
  isLn: PropTypes.bool.isRequired
}

export default Form
