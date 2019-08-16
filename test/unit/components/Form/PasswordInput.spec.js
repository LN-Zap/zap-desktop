import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { PasswordInput } from 'components/Form'

describe('component.UI.PasswordInput', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<PasswordInput field="password" />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
