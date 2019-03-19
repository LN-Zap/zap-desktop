import { mainLog } from '../../utils/log'
import { decodePayReq } from '../../utils/crypto'

export default function pushpayment(lnd, event, payload) {
  return new Promise((resolve, reject) => {
    try {
      const call = lnd.sendPayment(payload)

      call.on('data', data => {
        const isSuccess = !data.payment_error
        if (isSuccess) {
          mainLog.info('PAYMENT SUCCESS', data)

          // Convert payment_hash to hex string.
          let paymentHash = data.payment_hash
          if (paymentHash) {
            paymentHash = paymentHash.toString('hex')
          }

          // In some cases lnd does not return the payment_hash. If this happens, retrieve it from the invoice.
          else {
            const invoice = decodePayReq(payload.payment_request)
            const paymentHashTag = invoice.tags
              ? invoice.tags.find(t => t.tagName === 'payment_hash')
              : null
            paymentHash = paymentHashTag ? paymentHashTag.data : null
          }

          // Convert the preimage to a hex string.
          const paymentPreimage = data.payment_preimage
            ? data.payment_preimage.toString('hex')
            : null

          // Notify the client of a successful payment.
          event.sender.send('paymentSuccessful', {
            ...payload,
            data,
            payment_preimage: paymentPreimage,
            payment_hash: paymentHash,
          })
        }

        // Notify the client if there was a problem sending the payment
        else {
          mainLog.error('PAYMENT ERROR', data)
          event.sender.send('paymentFailed', { ...payload, error: data.payment_error })
        }

        call.on('status', status => {
          mainLog.info('PAYMENT STATUS', status)
        })

        call.on('end', () => {
          mainLog.info('PAYMENT END')
        })

        // TODO: Payment stream should be kept around and reused.
        call.end()
      })

      call.write(payload)

      resolve(call)
    } catch (error) {
      event.sender.send('paymentFailed', { ...payload, error: error.toString() })
      reject(error)
    }
  })
}
