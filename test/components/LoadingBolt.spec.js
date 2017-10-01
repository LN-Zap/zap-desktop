import React from 'react'
import { shallow } from 'enzyme'
import Isvg from 'react-inlinesvg'
import LoadingBolt from '../../app/components/LoadingBolt'

describe('component.LoadingBolt', () => {
  const el = shallow(<LoadingBolt />)
  it('should show defaults', () => {
    expect(el.find(Isvg).props().src).toContain('cloudbolt.svg')
    expect(el.text()).toContain('loading')
  })
})
