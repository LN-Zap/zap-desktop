import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Isvg from 'react-inlinesvg'

import LoadingBolt from 'components/LoadingBolt'
import cloudboltIcon from 'icons/cloudbolt.svg'

configure({ adapter: new Adapter() })

describe('component.LoadingBolt', () => {
  const el = shallow(<LoadingBolt />)
  it('should show defaults', () => {
    expect(el.find(Isvg).props().src).toContain(cloudboltIcon)
    expect(el.text()).toContain('loading')
  })
})
