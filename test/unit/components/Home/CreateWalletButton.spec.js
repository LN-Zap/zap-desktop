import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { CreateWalletButton } from 'components/Home'

const history = { push: jest.fn() }

describe('component.CreateWalletButton', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<CreateWalletButton history={history} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
