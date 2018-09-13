import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { FaDollarSign } from 'react-icons/fa'
import CryptoIcon from 'components/CryptoIcon'
import CurrencyIcon from 'components/CurrencyIcon'

configure({ adapter: new Adapter() })

const defaultProps = {
  currency: '',
  crypto: '',
  styles: {}
}

describe('component.CurrencyIcon', () => {
  describe('currency is "usd"', () => {
    const props = { ...defaultProps, currency: 'usd' }
    const el = shallow(<CurrencyIcon {...props} />)
    it('should show usd symbol', () => {
      expect(el.find(FaDollarSign)).toHaveLength(1)
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
