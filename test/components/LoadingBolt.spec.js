import React from 'react'
import { shallow } from 'enzyme'
import Isvg from 'react-inlinesvg'
import LoadingBolt from '../../app/components/LoadingBolt'
import cloudboltIcon from '../../app/icons/cloudbolt.svg'

describe('component.LoadingBolt', () => {
  const el = shallow(<LoadingBolt />)
  it('should show defaults', () => {
    expect(el.find(Isvg).props().src).toContain(cloudboltIcon)
    expect(el.text()).toContain('loading')
  })
})
