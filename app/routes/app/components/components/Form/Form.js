import React from 'react'
import PropTypes from 'prop-types'
import { MdClose } from 'react-icons/lib/md'
import Pay from './components/Pay'
import Request from './components/Request'
import styles from './Form.scss'

const Form = ({
  form: { formType, amount, onchainAmount, message, payment_request },
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
  isLn,
  sendingTransaction
}) => (
  <div className={`${styles.formContainer} ${isOpen ? styles.open : ''}`}>
    <div className={styles.container}>
      <div className={styles.esc} onClick={close}>
        <MdClose />
      </div>
      <div className={styles.content}>
        {
          formType === 'pay' ?
            <Pay
              sendingTransaction={sendingTransaction}
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

Form.propTypes = {
  form: PropTypes.object.isRequired,
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
  isLn: PropTypes.bool.isRequired,
  sendingTransaction: PropTypes.bool.isRequired
}

export default Form
