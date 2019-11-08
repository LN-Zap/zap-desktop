/* eslint-disable max-len */
import {
  btcToBits,
  btcToSatoshis,
  btcToMillisatoshis,
  btcToFiat,
  bitsToBtc,
  bitsToSatoshis,
  bitsToMillisatoshis,
  bitsToFiat,
  satoshisToBtc,
  satoshisToBits,
  satoshisToMillisatoshis,
  satoshisToFiat,
  millisatoshisToSatoshis,
  millisatoshisToBits,
  millisatoshisToBtc,
  millisatoshisToFiat,
  convert,
} from '@zap/utils/btc'

describe('btc.btcToBits', () => {
  it('should return 1 when 100 satoshis are passed in', () => {
    expect(btcToBits(0.000001)).toEqual(1)
  })

  it('should return 0.5 when 50 satoshis are passed in', () => {
    expect(btcToBits(0.0000005)).toEqual(0.5)
  })

  it('should return 1,000,000 when a whole bitcoin is passed in', () => {
    expect(btcToBits(1.0)).toEqual(1000000)
  })
})

describe('btc.btcToSatoshis', () => {
  it('should return 1 when 1 satoshi is passed in', () => {
    expect(btcToSatoshis(0.00000001)).toEqual(1)
  })
})

describe('btc.btcToFiat', () => {
  it('should return 668.50 when 0.5btc is passed in at a price of 1337', () => {
    expect(btcToFiat(0.5, 1337)).toEqual(668.5)
  })
})

describe('btc.bitsToBtc', () => {
  it('should return 0.00000100 when 1 bit is passed in', () => {
    expect(bitsToBtc(1)).toEqual(0.000001)
  })
})

describe('btc.bitsToSatoshis', () => {
  it('should return 100 when 1 bit is passed in', () => {
    expect(bitsToSatoshis(1)).toEqual(100)
  })
})

describe('btc.bitsToMillisatoshis', () => {
  it('should return 100,000 when 1 bit is passed in', () => {
    expect(bitsToMillisatoshis(1)).toEqual(100000)
  })
})

describe('btc.satoshisToBtc', () => {
  it('should return 0.00000001 when 1 satoshi is passed in', () => {
    expect(satoshisToBtc(1)).toEqual(0.00000001)
  })

  it('should return 0.00000002 when a between 1 and 2 satoshi value is passed in', () => {
    expect(satoshisToBtc(1.25)).toEqual(0.00000002)
  })
})

describe('btc.satoshisToBits', () => {
  it('should return 1 when 100 satoshis are passed in', () => {
    expect(satoshisToBits(100)).toEqual(1)
  })

  it('should return 123.45 when 12,345 satoshis are passed in', () => {
    expect(satoshisToBits(12345)).toEqual(123.45)
  })
})

describe('btc.millisatoshisToBtc', () => {
  it('should return 0.00000001 (1 satoshi) when 1000 millisatoshis are passed in', () => {
    expect(millisatoshisToBtc(1000)).toEqual(0.00000001)
  })
})

describe('btc.millisatoshisToBits', () => {
  it('should return 1 when 100,000 millisatoshis are passed in', () => {
    expect(millisatoshisToBits(100000)).toEqual(1)
  })

  it('should return 1.23456 when 123,456 millisatoshis are passed in', () => {
    expect(millisatoshisToBits(123456)).toEqual(1.23456)
  })
})

describe('btc.millisatoshisToSatoshis', () => {
  it('should return 1 when 1000 millisatoshis are passed in', () => {
    expect(millisatoshisToSatoshis(1000)).toEqual(1)
  })
})

describe('btc.millisatoshisToFiat', () => {
  it('should return 1.58 when 1,000 msats are passed in at the price of 157,673,000', () => {
    expect(millisatoshisToFiat(1000, 157673000)).toEqual(1.58)
  })
})

describe('btc.btcToMillisatoshis', () => {
  it('should return 1 when 0.001 satoshis are passed in', () => {
    expect(btcToMillisatoshis(0.00000000001)).toEqual(1)
  })
})

describe('btc.satoshisToMillisatoshis', () => {
  it('should return 1000 when 1 satoshi is passed in', () => {
    expect(satoshisToMillisatoshis(1)).toEqual(1000)
  })
})

describe('btc.satoshisToFiat', () => {
  it('should return 1.58 when 1 sat is passed in at the price of 157,673,000', () => {
    expect(satoshisToFiat(1, 157673000)).toEqual(1.58)
  })
})

describe('btc.bitsToFiat', () => {
  it('should return 1.58 when 1 bit is passed in at a price of 1,578,000', () => {
    expect(bitsToFiat(1, 1578000)).toEqual(1.58)
  })

  it('should return 1.50 when 1 bit is passed in at a price of 1,500,000', () => {
    expect(bitsToFiat(1, 1500000)).toEqual(1.5)
  })

  it('should return 1.00 when 1 bit is passed in at a price of 1,000,000', () => {
    expect(bitsToFiat(1, 1000000)).toEqual(1)
  })

  it('should return 0.32 when 1 bit is passed in at a price of 320,000', () => {
    expect(bitsToFiat(1, 320000)).toEqual(0.32)
  })

  it('should return 0.01 when 1 bit is passed in at a price of 10,000', () => {
    expect(bitsToFiat(1, 10000)).toEqual(0.01)
  })

  it('should return 0.01 when 1 bit is passed in at a price of 14,999', () => {
    expect(bitsToFiat(1, 14999)).toEqual(0.01)
  })
})