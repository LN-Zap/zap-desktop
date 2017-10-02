import React from 'react'
import { shallow } from 'enzyme'
import ReactSVG from 'react-svg'
import { NavLink } from 'react-router-dom'
import { MdAccountBalanceWallet } from 'react-icons/lib/md'
import { FaClockO, FaDollar } from 'react-icons/lib/fa'
import Nav from 'components/Nav'

const defaultProps = {
  ticker: {
    currency: 'usd',
    crypto: 'btc'
  },
  balance: {},
  setCurrency: () => {},
  currentTicker: {},
  openPayForm: () => {},
  openRequestForm: () => {}
}

describe('default elements', () => {
  const props = { ...defaultProps }
  const el = shallow(<Nav {...props} />)

  describe('currencies', () => {
    it('should render currency conversion links', () => {
      expect(el.find('.currencies').length).toBe(1)
      expect(el.find(FaDollar).length).toBe(1)
    })
  })

  describe('balances', () => {
    expect(el.find('.balance').length).toBe(1)
    it('should render wallet balance', () => {})
    it('should render channel balance', () => {})
  })

  it('should render logo', () => {
    expect(el.find(ReactSVG).props().path).toContain('zap_2.svg')
  })
  it('should render nav links', () => {
    expect(el.find(NavLink).at(0).props().to).toBe('/')
    expect(el.find(NavLink).at(1).props().to).toBe('/wallet')
    expect(el.find(FaClockO)).toHaveLength(1)
    expect(el.find(MdAccountBalanceWallet)).toHaveLength(1)
  })
  it('should render buttons', () => {
    expect(el.find('.button').at(0).text()).toContain('Pay')
    expect(el.find('.button').at(1).text()).toContain('Request')
  })
})
