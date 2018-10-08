/* eslint-disable max-len */
import { isLn, isOnchain } from 'lib/utils/crypto'

const VALID_BITCOIN_MAINNET_LN =
  'lnbc10u1pduey89pp57gt0mqvh9gv4m5kkxmy9a0a46ha5jlzr3mcfcz2fx8tzu63vpjksdq8w3jhxaqcqzystfg0drarrx89nvpegwykvfr4fypvwz2d9ktcr6tj5s08f0nn8gdjnv74y9amksk3rjw7englhjrsev70k77vwf603qh2pr4tnqeue6qp5n92gy'
const VALID_BITCOIN_TESTNET_LN =
  'lntb10u1pdue0gxpp5uljstna5aenp3yku3ft4wn8y63qfqdgqfh4cqqxz8z58undqp8hqdqqcqzysxqyz5vqqwaeuuh0fy52tqx6rrq6kya4lwm6v523wyqe9nesd5a3mszcq7j4e9mv8rd2vhmp7ycxswtktvs8gqq8lu5awjwfevnvfc4rzp8fmacpp4h27e'

const VALID_LITECOIN_MAINNET_LN =
  'lnltc241pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqsnp4q0n326hr8v9zprg8gsvezcch06gfaqqhde2aj730yg0durunfhv66859t2d55efrxdlgqg9hdqskfstdmyssdw4fjc8qdl522ct885pqk7acn2aczh0jeht0xhuhnkmm3h0qsrxedlwm9x86787zzn4qwwwcpjkl3t2'
const VALID_LITECOIN_TESTNET_LN =
  'lntltc241pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqsnp4q0n326hr8v9zprg8gsvezcch06gfaqqhde2aj730yg0durunfhv66m2eq2fx9uctzkmj30meaghyskkgsd6geap5qg9j2ae444z24a4p8xg3a6g73p8l7d689vtrlgzj0wyx2h6atq8dfty7wmkt4frx9g9sp730h5a'

describe('Crypto.isLn', () => {
  describe('Bitcoin', () => {
    describe('Mainnet', () => {
      it('should pass with a valid invoice ', () => {
        expect(isLn(VALID_BITCOIN_MAINNET_LN, 'bitcoin', 'mainnet')).toBeTruthy()
      })
      it('should fail with an invalid invoice ', () => {
        expect(isLn(VALID_BITCOIN_TESTNET_LN, 'bitcoin', 'mainnet')).toBeFalsy()
      })
    })
    describe('Testnet', () => {
      it('should pass with a valid invoice', () => {
        expect(isLn(VALID_BITCOIN_TESTNET_LN, 'bitcoin', 'testnet')).toBeTruthy()
      })
      it('should fail with an invalid invoice ', () => {
        expect(isLn(VALID_BITCOIN_MAINNET_LN, 'bitcoin', 'testnet')).toBeFalsy()
      })
    })
  })

  describe('Litecoin', () => {
    describe('Mainnet', () => {
      it('should pass with a valid invoice ', () => {
        expect(isLn(VALID_LITECOIN_MAINNET_LN, 'litecoin', 'mainnet')).toBeTruthy()
      })
      it('should fail with an invalid invoice ', () => {
        expect(isLn(VALID_LITECOIN_TESTNET_LN, 'litecoin', 'mainnet')).toBeFalsy()
      })
    })
    describe('Testnet', () => {
      it('should pass with a valid invoice', () => {
        expect(isLn(VALID_LITECOIN_TESTNET_LN, 'litecoin', 'testnet')).toBeTruthy()
      })
      it('should fail with an invalid invoice ', () => {
        expect(isLn(VALID_LITECOIN_MAINNET_LN, 'litecoin', 'testnet')).toBeFalsy()
      })
    })
  })
})

const VALID_BITCOIN_MAINNET = '3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC'
const VALID_BITCOIN_TESTNET = '2NBMEX8USTXf5uPiW16QYX2AETytrJBCK52'

const VALID_LITECOIN_MAINNET = 'LW9Q7QU8dgaGBerVkxbmVfurr2E1cFudrn'
const VALID_LITECOIN_TESTNET = '2MvCEgZGPnwA5HmZ3GDXB4EteMZzxgS54it'

describe('Crypto.isOnchain', () => {
  describe('Bitcoin', () => {
    describe('Mainnet', () => {
      it('should pass with a valid address ', () => {
        expect(isOnchain(VALID_BITCOIN_MAINNET, 'bitcoin', 'mainnet')).toBeTruthy()
      })
      it('should fail with an invalid address ', () => {
        expect(isOnchain(VALID_BITCOIN_TESTNET, 'bitcoin', 'mainnet')).toBeFalsy()
      })
    })
    describe('Testnet', () => {
      it('should pass with a valid address', () => {
        expect(isOnchain(VALID_BITCOIN_TESTNET, 'bitcoin', 'testnet')).toBeTruthy()
      })
      it('should fail with an invalid address ', () => {
        expect(isOnchain(VALID_BITCOIN_MAINNET, 'bitcoin', 'testnet')).toBeFalsy()
      })
    })
  })

  describe('Litecoin', () => {
    describe('Mainnet', () => {
      it('should pass with a valid address ', () => {
        expect(isOnchain(VALID_LITECOIN_MAINNET, 'litecoin', 'mainnet')).toBeTruthy()
      })
      // FIXME: TWe don't yet fully support litecoin, so this check always returns true for litecoin addresses
      it('should pass with an invalid address ', () => {
        expect(isOnchain(VALID_LITECOIN_TESTNET, 'litecoin', 'mainnet')).toBeTruthy()
      })
    })
    describe('Testnet', () => {
      it('should pass with a valid address', () => {
        expect(isOnchain(VALID_LITECOIN_TESTNET, 'litecoin', 'testnet')).toBeTruthy()
      })
      // FIXME: TWe don't yet fully support litecoin, so this check always returns true for litecoin addresses
      it('should pass with an invalid address ', () => {
        expect(isOnchain(VALID_LITECOIN_MAINNET, 'litecoin', 'testnet')).toBeTruthy()
      })
    })
  })
})
