import zbase32 from 'zbase32'

function convertBigEndianBufferToLong(longBuffer) {
  let longValue = 0
  const byteArray = Buffer.from(longBuffer).swap64()

  for (let i = byteArray.length - 1; i >= 0; i -= 1) {
    longValue = (longValue * 256) + byteArray[i]
  }

  return longValue
}

export function decodeInvoice(payreq) {
  const payreqBase32 = zbase32.decode(payreq)

  const bufferHexRotated = Buffer.from(payreqBase32).toString('hex')
  const bufferHex = bufferHexRotated.substr(bufferHexRotated.length - 1, bufferHexRotated.length)
      + bufferHexRotated.substr(0, bufferHexRotated.length - 1)
  const buffer = Buffer.from(bufferHex, 'hex')

  var pubkeyBuffer = buffer.slice(0, 33);
  var pubkey = pubkeyBuffer.toString('hex');

  const paymentHashBuffer = buffer.slice(33, 65)
  const paymentHashHex = paymentHashBuffer.toString('hex')

  const valueBuffer = buffer.slice(65, 73)

  const amount = convertBigEndianBufferToLong(valueBuffer)

  return {
    payreq,
    pubkey,
    amount,
    r_hash: paymentHashHex
  }
}

export default {
  decodeInvoice
}
