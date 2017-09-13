import React from 'react'
import PropTypes from 'prop-types'
import { MdClose } from 'react-icons/lib/md'
import Pay from './components/Pay'
import Request from './components/Request'
import CurrencyIcon from '../../../../../components/CurrencyIcon'
import { btc } from '../../../../../utils'
import styles from './Form.scss'

const Form = ({
  form: { formType, amount, message, payment_request },
  setAmount,
  setMessage,
  setPaymentRequest,
  ticker: { currency, crypto },
  isOpen,
  close,
  createInvoice,
  payInvoice,
  fetchInvoice,
  formInvoice,
  currentTicker
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
                amount={formInvoice.amount}
                payment_request={payment_request}
                setPaymentRequest={setPaymentRequest}
                fetchInvoice={fetchInvoice}
                payInvoice={payInvoice}
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
  form: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  setAmount: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  setPaymentRequest: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  createInvoice: PropTypes.func.isRequired,
  payInvoice: PropTypes.func.isRequired,
  fetchInvoice: PropTypes.func.isRequired,
  formInvoice: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired
}

export default Form
