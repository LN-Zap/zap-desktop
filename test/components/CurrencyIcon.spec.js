import React from 'react'
import { shallow } from 'enzyme'
import { FaDollar } from 'react-icons/lib/fa'
import CryptoIcon from '../../app/components/CryptoIcon'
import CurrencyIcon from '../../app/components/CurrencyIcon'

const defaultProps = {
  currency: '',
  crypto: '',
  styles: {}
}

describe('component.CurrencyIcon', () => {
  describe('currency is "usd"', () => {
    const props = { ...defaultProps, currency: 'usd' }
    const el = shallow(<CurrencyIcon {...props} />)
    it('should show usd symbo', () => {
      expect(el.find(FaDollar)).toHaveLength(1)
    })
  })

  describe('currency is not "usd"', () => {
    const props = { ...defaultProps, currency: 'btc' }
    const el = shallow(<CurrencyIcon {...props} />)
    it('should show btc symbol', () => {
      expect(el.find(CryptoIcon)).toHaveLength(1)
    })
  })
})
