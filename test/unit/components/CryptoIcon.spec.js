import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Isvg from 'react-inlinesvg'
import CryptoIcon from 'components/CryptoIcon'

import skinnyBitcoinIcon from 'icons/skinny-bitcoin.svg'
import litecoinIcon from 'icons/litecoin.svg'

configure({ adapter: new Adapter() })

const defaultProps = {
  currency: 'bch',
  styles: {}
}

describe('component.CryptoIcon', () => {
  describe('currency is "unknown"', () => {
    const props = { ...defaultProps }
    const el = shallow(<CryptoIcon {...props} />)
    it('should show empty span', () => {
      expect(el.html()).toEqual('<span></span>')
    })
  })

  describe('currency is "btc"', () => {
    const props = { ...defaultProps, currency: 'btc' }
    const el = shallow(<CryptoIcon {...props} />)
    it('should show btc symbol', () => {
      expect(el.find(Isvg).props().src).toContain(skinnyBitcoinIcon)
    })
  })

  describe('currency is "ltc"', () => {
    const props = { ...defaultProps, currency: 'ltc' }
    const el = shallow(<CryptoIcon {...props} />)
    it('should show ltc symbol', () => {
      expect(el.find(Isvg).props().src).toContain(litecoinIcon)
    })
  })
})
