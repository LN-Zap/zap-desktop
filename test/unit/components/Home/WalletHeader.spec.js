import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { WalletHeader } from 'components/Home'

describe('component.WalletHeader', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<WalletHeader title="wallet 1" />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
