/* eslint-disable max-len */
import {
  formatValue,
  isLn,
  isOnchain,
  getMinFee,
  getMaxFee,
  getMaxFeeInclusive,
} from '@zap/utils/crypto'

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
const VALID_LITECOIN_TESTNET = 'Qbssgb8huSkT8adTGoyoSZpHrbcUEz2vnY'

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
      it('should fail with an invalid address ', () => {
        expect(isOnchain(VALID_LITECOIN_TESTNET, 'litecoin', 'mainnet')).toBeFalsy()
      })
    })
    describe('Testnet', () => {
      it('should pass with a valid address', () => {
        expect(isOnchain(VALID_LITECOIN_TESTNET, 'litecoin', 'testnet')).toBeTruthy()
      })
      it('should fail with an invalid address ', () => {
        expect(isOnchain(VALID_LITECOIN_MAINNET, 'litecoin', 'testnet')).toBeFalsy()
      })
    })
  })
})

describe('formatValue', () => {
  const test = (from, to) => {
    expect(formatValue(from[0], from[1])).toEqual(to)
  }

  it('turns parsed number into a string', () => {
    test(['0', null], '0')
    test(['00', null], '00')
    test(['0', ''], '0.')

    test(['1', null], '1')
    test(['01', null], '01')
    test(['1', ''], '1.')

    test(['0', '0'], '0.0')
    test(['0', '1'], '0.1')

    test(['0', '01'], '0.01')
    test(['0', '10'], '0.10')

    test(['1', '0'], '1.0')
    test(['01', '0'], '01.0')
  })
})

describe('getMinFee', () => {
  const test = (from, to) => expect(getMinFee(from)).toEqual(to)
  it('returns the minimum fee (1 above the lowest value)', () => {
    test([], null)
    test([{ total_fees: 2 }], 3)
    test([{ total_fees: 2 }, { total_fees: 5 }], 3)
    test([{ total_fees: 4 }], 5)
    test([{ total_fees: 0 }], 1)
    test([{ total_fees: 85 }, { total_fees: 95 }], 86)
  })
})

describe('getMaxFee', () => {
  const test = (from, to) => expect(getMaxFee(from)).toEqual(to)
  it('returns the maximum fee (1 above the highest value)', () => {
    test([], null)
    test([{ total_fees: 2 }], 3)
    test([{ total_fees: 2 }, { total_fees: 5 }], 6)
    test([{ total_fees: 4 }], 5)
    test([{ total_fees: 0 }], 1)
    test([{ total_fees: 85 }, { total_fees: 95 }], 96)
  })
})

describe('getMaxFeeInclusive', () => {
  const test = (from, to) => expect(getMaxFeeInclusive(from)).toEqual(to)
  it('returns the minimum fee includding increases after all retry attempts', () => {
    test([], null)
    test([{ total_fees: 2 }], 5)
    test([{ total_fees: 2 }, { total_fees: 5 }], 8)
    test([{ total_fees: 4 }], 7)
    test([{ total_fees: 0 }], 3)
    test([{ total_fees: 85 }, { total_fees: 95 }], 117)
  })
})
