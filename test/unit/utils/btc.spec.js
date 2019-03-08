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
} from 'lib/utils/btc'

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

describe('btc.convert', () => {
  describe('from btc or ltc', () => {
    describe('to bits or phots', () => {
      it('should return 1 when 0.00000100 is passed in', () => {
        expect(convert('btc', 'bits', 0.000001)).toEqual(1)
        expect(convert('btc', 'phots', 0.000001)).toEqual(1)

        expect(convert('ltc', 'bits', 0.000001)).toEqual(1)
        expect(convert('ltc', 'phots', 0.000001)).toEqual(1)
      })
    })

    describe('to sats or lits', () => {
      it('should return 123 when 0.00000123 is passed in', () => {
        expect(convert('btc', 'sats', 0.00000123)).toEqual(123)
        expect(convert('btc', 'lits', 0.00000123)).toEqual(123)

        expect(convert('ltc', 'sats', 0.00000123)).toEqual(123)
        expect(convert('ltc', 'lits', 0.00000123)).toEqual(123)
      })
    })

    describe('to msats or mlits', () => {
      it('should return 123,000 when 0.00000123 is passed in', () => {
        expect(convert('btc', 'msats', 0.00000123)).toEqual(123000)
        expect(convert('btc', 'mlits', 0.00000123)).toEqual(123000)

        expect(convert('ltc', 'msats', 0.00000123)).toEqual(123000)
        expect(convert('ltc', 'mlits', 0.00000123)).toEqual(123000)
      })
    })

    describe('to btc or ltc', () => {
      it('should return 1 when 1 is passed in', () => {
        expect(convert('btc', 'btc', 1)).toEqual(1)
        expect(convert('btc', 'ltc', 1)).toEqual(1)

        expect(convert('ltc', 'btc', 1)).toEqual(1)
        expect(convert('ltc', 'ltc', 1)).toEqual(1)
      })
    })

    describe('to fiat', () => {
      it('should return 200.90 when 1 btc or ltc is passed in at the price of 100.45', () => {
        expect(convert('btc', 'fiat', 2, 100.45)).toEqual(200.9)
        expect(convert('btc', 'fiat', 2, 100.45)).toEqual(200.9)

        expect(convert('ltc', 'fiat', 2, 100.45)).toEqual(200.9)
        expect(convert('ltc', 'fiat', 2, 100.45)).toEqual(200.9)
      })
    })

    describe('to an unknown denomination', () => {
      it('should not fall through', () => {
        expect(convert('btc', 'lolkek', 2, 100.45)).toEqual(undefined)
        expect(convert('ltc', 'lolkek', 2, 100.45)).toEqual(undefined)
      })
    })
  })

  describe('from bits or phots', () => {
    describe('to btc or ltc', () => {
      it('should return 0.00000100 when 1 is passed in', () => {
        expect(convert('bits', 'btc', 1)).toEqual(0.000001)
        expect(convert('bits', 'ltc', 1)).toEqual(0.000001)

        expect(convert('phots', 'btc', 1)).toEqual(0.000001)
        expect(convert('phots', 'ltc', 1)).toEqual(0.000001)
      })
    })

    describe('to sats or lits', () => {
      it('should return 199 when 1.99 is passed in', () => {
        expect(convert('bits', 'sats', 1.99)).toEqual(199)
        expect(convert('bits', 'lits', 1.99)).toEqual(199)

        expect(convert('phots', 'sats', 1.99)).toEqual(199)
        expect(convert('phots', 'lits', 1.99)).toEqual(199)
      })
    })

    describe('to msats or mlits', () => {
      it('should return 135969 when 1.35969 is passed in', () => {
        expect(convert('bits', 'msats', 1.35969)).toEqual(135969)
        expect(convert('bits', 'mlits', 1.35969)).toEqual(135969)

        expect(convert('phots', 'msats', 1.35969)).toEqual(135969)
        expect(convert('phots', 'mlits', 1.35969)).toEqual(135969)
      })
    })

    describe('to bits or phots', () => {
      it('should return 1 when 1 is passed in', () => {
        expect(convert('bits', 'bits', 1)).toEqual(1)
        expect(convert('bits', 'phots', 1)).toEqual(1)

        expect(convert('phots', 'bits', 1)).toEqual(1)
        expect(convert('phots', 'phots', 1)).toEqual(1)
      })
    })

    describe('to fiat', () => {
      it('should return 1.00 when 1 bit or phot is passed in at a price of 1,000,000 ', () => {
        expect(convert('bits', 'fiat', 1, 1000000)).toEqual(1)
        expect(convert('phots', 'fiat', 1, 1000000)).toEqual(1)
      })
    })

    describe('to unknown denomination', () => {
      it('should not fall through', () => {
        expect(convert('bits', 'lolkek', 1, 1000000)).toEqual(undefined)
        expect(convert('phots', 'lolkek', 1, 1000000)).toEqual(undefined)
      })
    })
  })

  describe('from sats or lits', () => {
    describe('to btc or ltc', () => {
      it('should return 0.00000001 when 1 sat or lit is passed in', () => {
        expect(convert('sats', 'btc', 1)).toEqual(0.00000001)
        expect(convert('sats', 'ltc', 1)).toEqual(0.00000001)

        expect(convert('lits', 'btc', 1)).toEqual(0.00000001)
        expect(convert('lits', 'ltc', 1)).toEqual(0.00000001)
      })
    })

    describe('to bits or phots', () => {
      it('should return 1 when 100 sats or lits are passed in', () => {
        expect(convert('sats', 'bits', 100)).toEqual(1)
        expect(convert('sats', 'phots', 100)).toEqual(1)

        expect(convert('lits', 'bits', 100)).toEqual(1)
        expect(convert('lits', 'phots', 100)).toEqual(1)
      })
    })

    describe('to msats or mlits', () => {
      it('should return 1000 when 1 sat or lit is passed in', () => {
        expect(convert('sats', 'msats', 1)).toEqual(1000)
        expect(convert('sats', 'mlits', 1)).toEqual(1000)

        expect(convert('lits', 'msats', 1)).toEqual(1000)
        expect(convert('lits', 'mlits', 1)).toEqual(1000)
      })
    })

    describe('to sats or lits', () => {
      it('should return 1 when 1 sat or lit is passed in', () => {
        expect(convert('sats', 'sats', 1)).toEqual(1)
        expect(convert('sats', 'lits', 1)).toEqual(1)

        expect(convert('lits', 'sats', 1)).toEqual(1)
        expect(convert('lits', 'lits', 1)).toEqual(1)
      })
    })

    describe('to fiat', () => {
      it('should return 1 when 1 sat or lit is passed in at the price of 100,000,000', () => {
        expect(convert('sats', 'fiat', 1, 100000000)).toEqual(1)
        expect(convert('lits', 'fiat', 1, 100000000)).toEqual(1)
      })
    })

    describe('to an unknown denomination', () => {
      it('should not fall through', () => {
        expect(convert('sats', 'lolkek', 1, 1000000)).toEqual(undefined)
        expect(convert('lits', 'lolkek', 1, 1000000)).toEqual(undefined)
      })
    })
  })

  describe('from msats or mlits', () => {
    describe('to btc or ltc', () => {
      it('should return 0.00000001 when 1,000 msats or mlits are passed in', () => {
        expect(convert('msats', 'btc', 1000)).toEqual(0.00000001)
        expect(convert('msats', 'ltc', 1000)).toEqual(0.00000001)

        expect(convert('mlits', 'btc', 1000)).toEqual(0.00000001)
        expect(convert('mlits', 'ltc', 1000)).toEqual(0.00000001)
      })
    })

    describe('to bits or phots', () => {
      it('should return 1 when 100,000 msats or mlits are passed in', () => {
        expect(convert('msats', 'bits', 100000)).toEqual(1)
        expect(convert('msats', 'phots', 100000)).toEqual(1)

        expect(convert('mlits', 'bits', 100000)).toEqual(1)
        expect(convert('mlits', 'phots', 100000)).toEqual(1)
      })
    })

    describe('to msats or mlits', () => {
      it('should return 1 when 1 msat or mlit is passed in', () => {
        expect(convert('msats', 'msats', 1)).toEqual(1)
        expect(convert('msats', 'mlits', 1)).toEqual(1)

        expect(convert('mlits', 'msats', 1)).toEqual(1)
        expect(convert('mlits', 'mlits', 1)).toEqual(1)
      })
    })

    describe('to sats or lits', () => {
      it('should return 1 when 1,000 msats or mlits are passed in', () => {
        expect(convert('msats', 'sats', 1000)).toEqual(1)
        expect(convert('msats', 'lits', 1000)).toEqual(1)

        expect(convert('mlits', 'sats', 1000)).toEqual(1)
        expect(convert('mlits', 'lits', 1000)).toEqual(1)
      })
    })

    describe('to fiat', () => {
      it('should return 1 when 1,000 msats or mlits are passed in at the price of 100,000,000', () => {
        expect(convert('msats', 'fiat', 1000, 100000000)).toEqual(1)
        expect(convert('mlits', 'fiat', 1000, 100000000)).toEqual(1)
      })
    })

    describe('to an unknown denomination', () => {
      it('should not fall through', () => {
        expect(convert('msats', 'lolkek', 1, 1000000)).toEqual(undefined)
        expect(convert('mlits', 'lolkek', 1, 1000000)).toEqual(undefined)
      })
    })
  })

  describe('from fiat', () => {
    describe('to btc or ltc', () => {
      it('should return 0.01 at the price of 100', () => {
        expect(convert('fiat', 'btc', 1, 100)).toEqual(0.01)
        expect(convert('fiat', 'ltc', 1, 100)).toEqual(0.01)
      })
    })

    describe('to bits or phots', () => {
      it('should return 10,000 at the price of 100', () => {
        expect(convert('fiat', 'bits', 1, 100)).toEqual(10000)
        expect(convert('fiat', 'phots', 1, 100)).toEqual(10000)
      })
    })

    describe('to sats or lits', () => {
      it('should return 1,000,000 at the price of 100 when 1 fiat unit is passed in', () => {
        expect(convert('fiat', 'sats', 1, 100)).toEqual(1000000)
        expect(convert('fiat', 'lits', 1, 100)).toEqual(1000000)
      })
    })

    describe('to msats or mlits', () => {
      it('should return 1,000,000,000 at the price of 100 when 1 fiat unit is passed in', () => {
        expect(convert('fiat', 'msats', 1, 100)).toEqual(1000000000)
        expect(convert('fiat', 'mlits', 1, 100)).toEqual(1000000000)
      })
    })
  })

  it('should return an empty string when nothing is matched', () => {
    expect(convert('lol', 'kek', 420, 69)).toEqual('')
  })
})
