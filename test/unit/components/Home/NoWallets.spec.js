import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { NoWallets } from 'components/Home'

const history = { push: jest.fn() }

describe('component.NoWallets', () => {
  it('should render correctly (no wallets)', () => {
    const wrapper = shallow(<NoWallets history={history} wallets={[]} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('should render correctly (no selected wallet)', () => {
    const wrapper = shallow(<NoWallets history={history} wallets={[{ name: 'wallet 1' }]} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
