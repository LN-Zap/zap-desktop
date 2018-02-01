import React from 'react'
import { shallow } from 'enzyme'
import { NavLink } from 'react-router-dom'
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

  it('should render nav links', () => {
    expect(el.find(NavLink).at(0).props().to).toBe('/')
    expect(el.find(NavLink).at(1).props().to).toBe('/contacts')
  })
  it('should render buttons', () => {
    expect(el.find('.button').at(0).text()).toContain('Pay')
    expect(el.find('.button').at(1).text()).toContain('Request')
  })
})
