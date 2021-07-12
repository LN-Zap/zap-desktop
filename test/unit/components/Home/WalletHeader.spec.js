import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import WalletHeader from 'components/Home/WalletHeader'

describe('component.WalletHeader', () => {
  it('should render correctly', () => {
    const wallet = {
      type: 'local',
      id: 1,
      host: 'local.host',
      name: 'Wallet name',
    }
    const wrapper = shallow(<WalletHeader wallet={wallet} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
