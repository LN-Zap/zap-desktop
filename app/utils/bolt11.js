// credit to junderwood
// https://github.com/bitcoinjs/bolt11/pull/1
// TODO: use bolt11 package when published

'use strict'

import crypto from 'crypto'
import bech32 from 'bech32'
import secp256k1 from 'secp256k1'
import { Buffer } from 'safe-buffer'
import BN from 'bn.js'
import bitcoinjsNetworks from 'bitcoinjs-lib/src/networks'
import bitcoinjsAddress from 'bitcoinjs-lib/src/address'
import cloneDeep from 'lodash/cloneDeep'

// defaults for encode; default timestamp is current time at call
const DEFAULTNETWORKSTRING = 'testnet'
const DEFAULTNETWORK = bitcoinjsNetworks[DEFAULTNETWORKSTRING]
const DEFAULTEXPIRETIME = 3600
const DEFAULTCLTVEXPIRY = 9
const DEFAULTDESCRIPTION = ''

const VALIDWITNESSVERSIONS = [0]

const BECH32CODES = {
  bc: 'bitcoin',
  tb: 'testnet'
}

const DIVISORS = {
  m: new BN('1000', 10),
  u: new BN('1000000', 10),
  n: new BN('1000000000', 10),
  p: new BN('1000000000000', 10)
}

const MAX_SATS = new BN('2100000000000000', 10)

const SATS_PER_BTC = new BN(1e8, 10)
const SATS_PER_MILLIBTC = new BN(1e5, 10)
const SATS_PER_MICROBTC = new BN(1e2, 10)
const NANOBTC_PER_SATS = new BN(10, 10)

const TAGCODES = {
  payment_hash: 1,
  description: 13,
  payee_node_key: 19,
  purpose_commit_hash: 23, // commit to longer descriptions (like a website)
  expire_time: 6, // default: 3600 (1 hour)
  min_final_cltv_expiry: 24, // default: 9
  fallback_address: 9,
  routing_info: 3 // for extra routing info (private etc.)
}

// reverse the keys and values of TAGCODES and insert into TAGNAMES
const TAGNAMES = {}
for (let i = 0, keys = Object.keys(TAGCODES); i < keys.length; i++) {
  let currentName = keys[i]
  let currentCode = TAGCODES[keys[i]].toString()
  TAGNAMES[currentCode] = currentName
}

const TAGENCODERS = {
  payment_hash: hexToWord, // 256 bits
  description: textToWord, // string variable length
  payee_node_key: hexToWord, // 264 bits
  purpose_commit_hash: purposeCommitEncoder, // 256 bits
  expire_time: intBEToWords, // default: 3600 (1 hour)
  min_final_cltv_expiry: intBEToWords, // default: 9
  fallback_address: fallbackAddressEncoder,
  routing_info: routingInfoEncoder // for extra routing info (private etc.)
}

const TAGPARSERS = {
  '1': (words) => wordsToBuffer(words, true).toString('hex'), // 256 bits
  '13': (words) => wordsToBuffer(words, true).toString('utf8'), // string variable length
  '19': (words) => wordsToBuffer(words, true).toString('hex'), // 264 bits
  '23': (words) => wordsToBuffer(words, true).toString('hex'), // 256 bits
  '6': wordsToIntBE, // default: 3600 (1 hour)
  '24': wordsToIntBE, // default: 9
  '9': fallbackAddressParser,
  '3': routingInfoParser // for extra routing info (private etc.)
}

function wordsToIntBE (words) {
  return words.reverse().reduce((total, item, index) => {
    return total + item * Math.pow(32, index)
  }, 0)
}

function intBEToWords (intBE, bits) {
  let words = []
  if (bits === undefined) bits = 5
  intBE = Math.floor(intBE)
  if (intBE === 0) return [0]
  while (intBE > 0) {
    words.push(intBE & (Math.pow(2, bits) - 1))
    intBE = Math.floor(intBE / Math.pow(2, bits))
  }
  return words.reverse()
}

function sha256 (data) {
  return crypto.createHash('sha256').update(data).digest()
}

function convert (data, inBits, outBits) {
  let value = 0
  let bits = 0
  let maxV = (1 << outBits) - 1

  let result = []
  for (let i = 0; i < data.length; ++i) {
    value = (value << inBits) | data[i]
    bits += inBits

    while (bits >= outBits) {
      bits -= outBits
      result.push((value >> bits) & maxV)
    }
  }

  if (bits > 0) {
    result.push((value << (outBits - bits)) & maxV)
  }

  return result
}

function wordsToBuffer (words, trim) {
  let buffer = Buffer.from(convert(words, 5, 8, true))
  if (trim && words.length * 5 % 8 !== 0) {
    buffer = buffer.slice(0, -1)
  }
  return buffer
}

function hexToBuffer (hex) {
  if (hex !== undefined &&
      (typeof hex === 'string' || hex instanceof String) &&
      hex.match(/^([a-zA-Z0-9]{2})*$/)) {
    return Buffer.from(hex, 'hex')
  }
  return hex
}

function textToBuffer (text) {
  return Buffer.from(text, 'utf8')
}

function hexToWord (hex) {
  let buffer = hexToBuffer(hex)
  return bech32.toWords(buffer)
}

function textToWord (text) {
  let buffer = textToBuffer(text)
  let words = bech32.toWords(buffer)
  return words
}

// see encoder for details
function fallbackAddressParser (words, network) {
  let version = words[0]
  words = words.slice(1)

  let addressHash = wordsToBuffer(words, true)

  let address = null

  switch (version) {
    case 17:
      address = bitcoinjsAddress.toBase58Check(addressHash, network.pubKeyHash)
      break
    case 18:
      address = bitcoinjsAddress.toBase58Check(addressHash, network.scriptHash)
      break
    case 0:
      address = bitcoinjsAddress.toBech32(addressHash, version, network.bech32)
      break
  }

  return {
    code: version,
    address,
    addressHash: addressHash.toString('hex')
  }
}

// the code is the witness version OR 17 for P2PKH OR 18 for P2SH
// anything besides code 17 or 18 should be bech32 encoded address.
// 1 word for the code, and right pad with 0 if necessary for the addressHash
// (address parsing for encode is done in the encode function)
function fallbackAddressEncoder (data, network) {
  return [data.code].concat(hexToWord(data.addressHash))
}

// first convert from words to buffer, trimming padding where necessary
// parse in 51 byte chunks. See encoder for details.
function routingInfoParser (words) {
  let routes = []
  let pubkey, shortChannelId, feeBaseMSats, feeProportionalMillionths, cltvExpiryDelta
  let routesBuffer = wordsToBuffer(words, true)
  while (routesBuffer.length > 0) {
    pubkey = routesBuffer.slice(0, 33).toString('hex') // 33 bytes
    shortChannelId = routesBuffer.slice(33, 41).toString('hex') // 8 bytes
    feeBaseMSats = parseInt(routesBuffer.slice(41, 45).toString('hex'), 16) // 4 bytes
    feeProportionalMillionths = parseInt(routesBuffer.slice(45, 49).toString('hex'), 16) // 4 bytes
    cltvExpiryDelta = parseInt(routesBuffer.slice(49, 51).toString('hex'), 16) // 2 bytes

    routesBuffer = routesBuffer.slice(51)

    routes.push({
      pubkey,
      short_channel_id: shortChannelId,
      fee_base_msat: feeBaseMSats,
      fee_proportional_millionths: feeProportionalMillionths,
      cltv_expiry_delta: cltvExpiryDelta
    })
  }
  return routes
}

// routing info is encoded first as a large buffer
// 51 bytes for each channel
// 33 byte pubkey, 8 byte short_channel_id, 4 byte millisatoshi base fee (left padded)
// 4 byte fee proportional millionths and a 2 byte left padded CLTV expiry delta.
// after encoding these 51 byte chunks and concatenating them
// convert to words right padding 0 bits.
function routingInfoEncoder (datas) {
  let buffer = Buffer(0)
  datas.forEach(data => {
    buffer = Buffer.concat([buffer, hexToBuffer(data.pubkey)])
    buffer = Buffer.concat([buffer, hexToBuffer(data.short_channel_id)])
    buffer = Buffer.concat([buffer, Buffer([0, 0, 0].concat(intBEToWords(data.fee_base_msat, 8)).slice(-4))])
    buffer = Buffer.concat([buffer, Buffer([0, 0, 0].concat(intBEToWords(data.fee_proportional_millionths, 8)).slice(-4))])
    buffer = Buffer.concat([buffer, Buffer([0].concat(intBEToWords(data.cltv_expiry_delta, 8)).slice(-2))])
  })
  return hexToWord(buffer)
}

// if text, return the sha256 hash of the text as words.
// if hex, return the words representation of that data.
function purposeCommitEncoder (data) {
  let buffer
  if (data !== undefined && (typeof data === 'string' || data instanceof String)) {
    if (data.match(/^([a-zA-Z0-9]{2})*$/)) {
      buffer = Buffer.from(data, 'hex')
    } else {
      buffer = sha256(Buffer.from(data, 'utf8'))
    }
  } else {
    throw new Error('purpose or purpose commit must be a string or hex string')
  }
  return bech32.toWords(buffer)
}

function tagsItems (tags, tagName) {
  let tag = tags.filter(item => item.tagName === tagName)
  let data = tag.length > 0 ? tag[0].data : null
  return data
}

function tagsContainItem (tags, tagName) {
  return tagsItems(tags, tagName) !== null
}

function orderKeys (unorderedObj) {
  let orderedObj = {}
  Object.keys(unorderedObj).sort().forEach((key) => {
    orderedObj[key] = unorderedObj[key]
  })
  return orderedObj
}

function satToHrp (satoshis) {
  if (!satoshis.toString().match(/^\d+$/)) {
    throw new Error('satoshis must be an integer')
  }
  let satoshisBN = new BN(satoshis, 10)
  let satoshisString = satoshisBN.toString(10)
  let satoshisLength = satoshisString.length
  let divisorString, valueString
  if (satoshisLength > 8 && /0{8}$/.test(satoshisString)) {
    divisorString = ''
    valueString = satoshisBN.div(SATS_PER_BTC).toString(10)
  } else if (satoshisLength > 5 && /0{5}$/.test(satoshisString)) {
    divisorString = 'm'
    valueString = satoshisBN.div(SATS_PER_MILLIBTC).toString(10)
  } else if (satoshisLength > 2 && /0{2}$/.test(satoshisString)) {
    divisorString = 'u'
    valueString = satoshisBN.div(SATS_PER_MICROBTC).toString(10)
  } else {
    divisorString = 'n'
    valueString = satoshisBN.mul(NANOBTC_PER_SATS).toString(10)
  }
  return valueString + divisorString
}

function hrpToSat (hrpString, outputString) {
  let divisor, value
  if (hrpString.slice(-1).match(/^[munp]$/)) {
    divisor = hrpString.slice(-1)
    value = hrpString.slice(0, -1)
  } else if (hrpString.slice(-1).match(/^[^munp0-9]$/)) {
    throw new Error('Not a valid multiplier for the amount')
  } else {
    value = hrpString
  }

  if (!value.match(/^\d+$/)) throw new Error('Not a valid human readable amount')

  let valueBN = new BN(value, 10)

  let satoshisBN = divisor
    ? valueBN.mul(SATS_PER_BTC).div(DIVISORS[divisor])
    : valueBN.mul(SATS_PER_BTC)

  if (((divisor === 'n' && !valueBN.mod(new BN(10, 10)).eq(new BN(0, 10))) ||
      satoshisBN.gt(MAX_SATS)) ||
      divisor === 'p') {
    throw new Error('Amount is outside of valid range')
  }

  return outputString ? satoshisBN.toString() : satoshisBN
}

function sign (inputPayReqObj, inputPrivateKey) {
  let payReqObj = cloneDeep(inputPayReqObj)
  let privateKey = hexToBuffer(inputPrivateKey)
  if (payReqObj.complete && payReqObj.paymentRequest) return payReqObj

  if (privateKey === undefined || privateKey.length !== 32 ||
      !secp256k1.privateKeyVerify(privateKey)) {
    throw new Error('privateKey must be a 32 byte Buffer and valid private key')
  }

  let nodePublicKey, tagNodePublicKey
  // If there is a payee_node_key tag convert to buffer
  if (tagsContainItem(payReqObj.tags, TAGNAMES['19'])) {
    tagNodePublicKey = hexToBuffer(tagsItems(payReqObj.tags, TAGNAMES['19']))
  }
  // If there is payeeNodeKey attribute, convert to buffer
  if (payReqObj.payeeNodeKey) {
    nodePublicKey = hexToBuffer(payReqObj.payeeNodeKey)
  }
  // If they are not equal throw an error
  if (nodePublicKey && tagNodePublicKey && !tagNodePublicKey.equals(nodePublicKey)) {
    throw new Error('payee node key tag and payeeNodeKey attribute must match')
  }

  // make sure if either exist they are in nodePublicKey
  nodePublicKey = tagNodePublicKey || nodePublicKey

  let publicKey = secp256k1.publicKeyCreate(privateKey)

  // Check if pubkey matches for private key
  if (nodePublicKey && !publicKey.equals(nodePublicKey)) {
    throw new Error('The private key given is not the private key of the node public key given')
  }

  let words = bech32.decode(payReqObj.wordsTemp, Number.MAX_SAFE_INTEGER).words

  // the preimage for the signing data is the buffer of the prefix concatenated
  // with the buffer conversion of the data words excluding the signature
  // (right padded with 0 bits)
  let toSign = Buffer.concat([Buffer.from(payReqObj.prefix, 'utf8'), wordsToBuffer(words)])
  // single SHA256 hash for the signature
  let payReqHash = sha256(toSign)

  // signature is 64 bytes (32 byte r value and 32 byte s value concatenated)
  // PLUS one extra byte appended to the right with the recoveryID in [0,1,2,3]
  // Then convert to 5 bit words with right padding 0 bits.
  let sigObj = secp256k1.sign(payReqHash, privateKey)
  let sigWords = hexToWord(sigObj.signature.toString('hex') + '0' + sigObj.recovery)

  // append signature words to the words, mark as complete, and add the payreq
  payReqObj.payeeNodeKey = publicKey.toString('hex')
  payReqObj.signature = sigObj.signature.toString('hex')
  payReqObj.recoveryFlag = sigObj.recovery
  payReqObj.wordsTemp = bech32.encode('temp', words.concat(sigWords), Number.MAX_SAFE_INTEGER)
  payReqObj.complete = true
  payReqObj.paymentRequest = bech32.encode(payReqObj.prefix, words.concat(sigWords), Number.MAX_SAFE_INTEGER)

  return orderKeys(payReqObj)
}

/* MUST but default OK:
  coinType  (default: testnet OK)
  timestamp   (default: current time OK)

  MUST:
  signature OR privatekey
  tags[TAGNAMES['1']] (payment hash)
  tags[TAGNAMES['13']] OR tags[TAGNAMES['23']] (description or description for hashing (or description hash))

  MUST CHECK:
  IF tags[TAGNAMES['19']] (payee_node_key) THEN MUST CHECK THAT PUBKEY = PUBKEY OF PRIVATEKEY / SIGNATURE
  IF tags[TAGNAMES['9']] (fallback_address) THEN MUST CHECK THAT THE ADDRESS IS A VALID TYPE
  IF tags[TAGNAMES['3']] (routing_info) THEN MUST CHECK FOR ALL INFO IN EACH
*/
function encode (inputData, addDefaults) {
  // we don't want to affect the data being passed in, so we copy the object
  let data = cloneDeep(inputData)

  // by default we will add default values to description, expire time, and min cltv
  if (addDefaults === undefined) addDefaults = true

  let canReconstruct = !(data.signature === undefined || data.recoveryFlag === undefined)

  // if no cointype is defined, set to testnet
  let coinTypeObj
  if (data.coinType === undefined && !canReconstruct) {
    data.coinType = DEFAULTNETWORKSTRING
    coinTypeObj = DEFAULTNETWORK
  } else if (data.coinType === undefined && canReconstruct) {
    throw new Error('Need coinType for proper payment request reconstruction')
  } else {
    // if the coinType is not a valid name of a network in bitcoinjs-lib, fail
    if (!bitcoinjsNetworks[data.coinType]) throw new Error('Unknown coin type')
    coinTypeObj = bitcoinjsNetworks[data.coinType]
  }

  // use current time as default timestamp (seconds)
  if (data.timestamp === undefined && !canReconstruct) {
    data.timestamp = Math.floor(new Date().getTime() / 1000)
  } else if (data.timestamp === undefined && canReconstruct) {
    throw new Error('Need timestamp for proper payment request reconstruction')
  }

  if (data.tags === undefined) throw new Error('Payment Requests need tags array')

  // If no payment hash, fail
  if (!tagsContainItem(data.tags, TAGNAMES['1'])) {
    throw new Error('Lightning Payment Request needs a payment hash')
  }
  // If no description or purpose commit hash/message, fail
  if (!tagsContainItem(data.tags, TAGNAMES['13']) && !tagsContainItem(data.tags, TAGNAMES['23'])) {
    if (addDefaults) {
      data.tags.push({
        tagName: TAGNAMES['13'],
        data: DEFAULTDESCRIPTION
      })
    } else {
      throw new Error('Payment request requires description or purpose commit hash')
    }
  }

  // If a description exists, check to make sure the buffer isn't greater than
  // 639 bytes long, since 639 * 8 / 5 = 1023 words (5 bit) when padded
  if (tagsContainItem(data.tags, TAGNAMES['13']) &&
      Buffer.from(tagsItems(data.tags, TAGNAMES['13']), 'utf8').length > 639) {
    throw new Error('Description is too long: Max length 639 bytes')
  }

  // if there's no expire time, and it is not reconstructing (must have private key)
  // default to adding a 3600 second expire time (1 hour)
  if (!tagsContainItem(data.tags, TAGNAMES['6']) && !canReconstruct && addDefaults) {
    data.tags.push({
      tagName: TAGNAMES['6'],
      data: DEFAULTEXPIRETIME
    })
  }

  // if there's no minimum cltv time, and it is not reconstructing (must have private key)
  // default to adding a 9 block minimum cltv time (90 minutes for bitcoin)
  if (!tagsContainItem(data.tags, TAGNAMES['24']) && !canReconstruct && addDefaults) {
    data.tags.push({
      tagName: TAGNAMES['24'],
      data: DEFAULTCLTVEXPIRY
    })
  }

  let nodePublicKey, tagNodePublicKey
  // If there is a payee_node_key tag convert to buffer
  if (tagsContainItem(data.tags, TAGNAMES['19'])) tagNodePublicKey = hexToBuffer(tagsItems(data.tags, TAGNAMES['19']))
  // If there is payeeNodeKey attribute, convert to buffer
  if (data.payeeNodeKey) nodePublicKey = hexToBuffer(data.payeeNodeKey)
  if (nodePublicKey && tagNodePublicKey && !tagNodePublicKey.equals(nodePublicKey)) {
    throw new Error('payeeNodeKey and tag payee node key do not match')
  }
  // in case we have one or the other, make sure it's in nodePublicKey
  nodePublicKey = nodePublicKey || tagNodePublicKey
  if (nodePublicKey) data.payeeNodeKey = nodePublicKey.toString('hex')

  let code, addressHash, address
  // If there is a fallback address tag we must check it is valid
  if (tagsContainItem(data.tags, TAGNAMES['9'])) {
    let addrData = tagsItems(data.tags, TAGNAMES['9'])
    // Most people will just provide address so Hash and code will be undefined here
    address = addrData.address
    addressHash = addrData.addressHash
    code = addrData.code

    if (addressHash === undefined || code === undefined) {
      let bech32addr, base58addr
      try {
        bech32addr = bitcoinjsAddress.fromBech32(address)
        addressHash = bech32addr.data
        code = bech32addr.version
      } catch (e) {
        try {
          base58addr = bitcoinjsAddress.fromBase58Check(address)
          if (base58addr.version === coinTypeObj.pubKeyHash) {
            code = 17
          } else if (base58addr.version === coinTypeObj.scriptHash) {
            code = 18
          }
          addressHash = base58addr.hash
        } catch (f) {
          throw new Error('Fallback address type is unknown')
        }
      }
      if (bech32addr && !(bech32addr.version in VALIDWITNESSVERSIONS)) {
        throw new Error('Fallback address witness version is unknown')
      }
      if (bech32addr && bech32addr.prefix !== coinTypeObj.bech32) {
        throw new Error('Fallback address network type does not match payment request network type')
      }
      if (base58addr && base58addr.version !== coinTypeObj.pubKeyHash &&
          base58addr.version !== coinTypeObj.scriptHash) {
        throw new Error('Fallback address version (base58) is unknown or the network type is incorrect')
      }

      // FIXME: If addressHash or code is missing, add them to the original Object
      // after parsing the address value... this changes the actual attributes of the data object.
      // Not very clean.
      // Without this, a person can not specify a fallback address tag with only the address key.
      addrData.addressHash = addressHash.toString('hex')
      addrData.code = code
    }
  }

  // If there is route info tag, check that each route has all 4 necessary info
  if (tagsContainItem(data.tags, TAGNAMES['3'])) {
    let routingInfo = tagsItems(data.tags, TAGNAMES['3'])
    routingInfo.forEach(route => {
      if (route.pubkey === undefined ||
        route.short_channel_id === undefined ||
        route.fee_base_msat === undefined ||
        route.fee_proportional_millionths === undefined ||
        route.cltv_expiry_delta === undefined) {
        throw new Error('Routing info is incomplete')
      }
      if (!secp256k1.publicKeyVerify(hexToBuffer(route.pubkey))) {
        throw new Error('Routing info pubkey is not a valid pubkey')
      }
      let shortId = hexToBuffer(route.short_channel_id)
      if (!(shortId instanceof Buffer) || shortId.length !== 8) {
        throw new Error('Routing info short channel id must be 8 bytes')
      }
      if (typeof route.fee_base_msat !== 'number' ||
        Math.floor(route.fee_base_msat) !== route.fee_base_msat) {
        throw new Error('Routing info fee base msat is not an integer')
      }
      if (typeof route.fee_proportional_millionths !== 'number' ||
        Math.floor(route.fee_proportional_millionths) !== route.fee_proportional_millionths) {
        throw new Error('Routing info fee proportional millionths is not an integer')
      }
      if (typeof route.cltv_expiry_delta !== 'number' ||
        Math.floor(route.cltv_expiry_delta) !== route.cltv_expiry_delta) {
        throw new Error('Routing info cltv expiry delta is not an integer')
      }
    })
  }

  let prefix = 'ln'
  prefix += coinTypeObj.bech32

  let hrpString
  // calculate the smallest possible integer (removing zeroes) and add the best
  // divisor (m = milli, u = micro, n = nano, p = pico)
  if (data.satoshis) {
    hrpString = satToHrp(new BN(data.satoshis, 10))
  } else {
    hrpString = ''
  }

  // bech32 human readable part is lnbc2500m (ln + coinbech32 + satoshis (optional))
  // lnbc or lntb would be valid as well. (no value specified)
  prefix += hrpString

  // timestamp converted to 5 bit number array (left padded with 0 bits, NOT right padded)
  let timestampWords = intBEToWords(data.timestamp)

  let tags = data.tags
  let tagWords = []
  tags.forEach(tag => {
    // check if the tagName exists in the encoders object, if not throw Error.
    if (Object.keys(TAGENCODERS).indexOf(tag.tagName) === -1) {
      throw new Error('Unknown tag key: ' + tag.tagName)
    }
    // each tag starts with 1 word code for the tag
    tagWords.push(TAGCODES[tag.tagName])
    let encoder = TAGENCODERS[tag.tagName]
    let words = encoder(tag.data)
    // after the tag code, 2 words are used to store the length (in 5 bit words) of the tag data
    // (also left padded, most integers are left padded while buffers are right padded)
    tagWords = tagWords.concat([0].concat(intBEToWords(words.length)).slice(-2))
    // then append the tag data words
    tagWords = tagWords.concat(words)
  })

  // the data part of the bech32 is TIMESTAMP || TAGS || SIGNATURE
  // currently dataWords = TIMESTAMP || TAGS
  let dataWords = timestampWords.concat(tagWords)

  // the preimage for the signing data is the buffer of the prefix concatenated
  // with the buffer conversion of the data words excluding the signature
  // (right padded with 0 bits)
  let toSign = Buffer.concat([Buffer.from(prefix, 'utf8'), Buffer.from(convert(dataWords, 5, 8))])
  // single SHA256 hash for the signature
  let payReqHash = sha256(toSign)

  // signature is 64 bytes (32 byte r value and 32 byte s value concatenated)
  // PLUS one extra byte appended to the right with the recoveryID in [0,1,2,3]
  // Then convert to 5 bit words with right padding 0 bits.
  let sigWords
  if (canReconstruct) {
    /* Since BOLT11 does not require a payee_node_key tag in the specs,
    most parsers will have to recover the pubkey from the signature
    To ensure the tag data has been provided in the right order etc.
    we should check that the data we got and the node key given match when
    reconstructing a payment request from given signature and recoveryID.
    However, if a privatekey is given, the caller is the privkey owner.
    Earlier we check if the private key matches the payee node key IF they
    gave one. */
    if (nodePublicKey) {
      let recoveredPubkey = secp256k1.recover(payReqHash, Buffer.from(data.signature, 'hex'), data.recoveryFlag, true)
      if (nodePublicKey && !nodePublicKey.equals(recoveredPubkey)) {
        throw new Error('Signature, message, and recoveryID did not produce the same pubkey as payeeNodeKey')
      }
      sigWords = hexToWord(data.signature + '0' + data.recoveryFlag)
    } else {
      throw new Error('Reconstruction with signature and recoveryID requires payeeNodeKey to verify correctness of input data.')
    }
  }

  if (sigWords) dataWords = dataWords.concat(sigWords)

  if (tagsContainItem(data.tags, TAGNAMES['6'])) {
    data.timeExpireDate = data.timestamp + tagsItems(data.tags, TAGNAMES['6'])
    data.timeExpireDateString = new Date(data.timeExpireDate * 1000).toISOString()
  }
  data.timestampString = new Date(data.timestamp * 1000).toISOString()
  data.paymentRequest = data.complete ? bech32.encode(prefix, dataWords, Number.MAX_SAFE_INTEGER) : ''
  data.prefix = prefix
  data.wordsTemp = bech32.encode('temp', dataWords, Number.MAX_SAFE_INTEGER)
  data.complete = !!sigWords

  // payment requests get pretty long. Nothing in the spec says anything about length.
  // Even though bech32 loses error correction power over 1023 characters.
  return orderKeys(data)
}

// decode will only have extra comments that aren't covered in encode comments.
// also if anything is hard to read I'll comment.
function decode (paymentRequest) {
  if (paymentRequest.slice(0, 2) !== 'ln') throw new Error('Not a proper lightning payment request')
  let decoded = bech32.decode(paymentRequest, Number.MAX_SAFE_INTEGER)
  let prefix = decoded.prefix
  let words = decoded.words

  // signature is always 104 words on the end
  // cutting off at the beginning helps since there's no way to tell
  // ahead of time how many tags there are.
  let sigWords = words.slice(-104)
  // grabbing a copy of the words for later, words will be sliced as we parse.
  let wordsNoSig = words.slice(0, -104)
  words = words.slice(0, -104)

  let sigBuffer = wordsToBuffer(sigWords, true)
  let recoveryFlag = sigBuffer.slice(-1)[0]
  sigBuffer = sigBuffer.slice(0, -1)

  if (!(recoveryFlag in [0, 1, 2, 3]) || sigBuffer.length !== 64) {
    throw new Error('Signature is missing or incorrect')
  }

  // Without reverse lookups, can't say that the multipier at the end must
  // have a number before it, so instead we parse, and if the second group
  // doesn't have anything, there's a good chance the last letter of the
  // coin type got captured by the third group, so just re-regex without
  // the number.
  let prefixMatches = prefix.match(/^ln(\S+?)(\d*)([a-zA-Z]?)$/)
  if (prefixMatches && !prefixMatches[2]) prefixMatches = prefix.match(/^ln(\S+)$/)
  if (!prefixMatches) {
    throw new Error('Not a proper lightning payment request')
  }

  let coinType = prefixMatches[1]
  let coinNetwork
  if (BECH32CODES[coinType]) {
    coinType = BECH32CODES[coinType]
    coinNetwork = bitcoinjsNetworks[coinType]
  } else {
    throw new Error('Unknown coin bech32 prefix')
  }

  let value = prefixMatches[2]
  let satoshis
  if (value) {
    let divisor = prefixMatches[3]
    satoshis = parseInt(hrpToSat(value + divisor, true))
  } else {
    satoshis = null
  }

  // reminder: left padded 0 bits
  let timestamp = wordsToIntBE(words.slice(0, 7))
  let timestampString = new Date(timestamp * 1000).toISOString()
  words = words.slice(7) // trim off the left 7 words

  let tags = []
  let tagName, parser, tagLength, tagWords
  // we have no tag count to go on, so just keep hacking off words
  // until we have none.
  while (words.length > 0) {
    tagName = TAGNAMES[words[0].toString()]
    parser = TAGPARSERS[words[0].toString()]
    words = words.slice(1)

    tagLength = wordsToIntBE(words.slice(0, 2))
    words = words.slice(2)

    tagWords = words.slice(0, tagLength)
    words = words.slice(tagLength)

    // See: parsers for more comments
    tags.push({
      tagName,
      data: parser(tagWords, coinNetwork) // only fallback address needs coinNetwork
    })
  }

  let timeExpireDate, timeExpireDateString
  // be kind and provide an absolute expiration date.
  // good for logs
  if (tagsContainItem(tags, TAGNAMES['6'])) {
    timeExpireDate = timestamp + tagsItems(tags, TAGNAMES['6'])
    timeExpireDateString = new Date(timeExpireDate * 1000).toISOString()
  }

  let toSign = Buffer.concat([Buffer.from(prefix, 'utf8'), Buffer.from(convert(wordsNoSig, 5, 8))])
  let payReqHash = sha256(toSign)
  let sigPubkey = secp256k1.recover(payReqHash, sigBuffer, recoveryFlag, true)
  if (tagsContainItem(tags, TAGNAMES['19']) && tagsItems(tags, TAGNAMES['19']) !== sigPubkey.toString('hex')) {
    throw new Error('Lightning Payment Request signature pubkey does not match payee pubkey')
  }

  let finalResult = {
    paymentRequest,
    complete: true,
    prefix,
    wordsTemp: bech32.encode('temp', wordsNoSig.concat(sigWords), Number.MAX_SAFE_INTEGER),
    coinType,
    satoshis,
    timestamp,
    timestampString,
    payeeNodeKey: sigPubkey.toString('hex'),
    signature: sigBuffer.toString('hex'),
    recoveryFlag,
    tags
  }

  if (timeExpireDate) {
    finalResult = Object.assign(finalResult, {timeExpireDate, timeExpireDateString})
  }

  return orderKeys(finalResult)
}

module.exports = {
  encode,
  decode,
  sign,
  satToHrp,
  hrpToSat
}