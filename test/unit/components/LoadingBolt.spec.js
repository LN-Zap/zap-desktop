import React from 'react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Isvg from 'react-inlinesvg'

import LoadingBolt from 'components/LoadingBolt'
import cloudboltIcon from 'icons/cloudbolt.svg'

import { mountWithIntl } from '../__helpers__/intl-enzyme-test-helper'

configure({ adapter: new Adapter() })

describe('component.LoadingBolt', () => {
  const el = mountWithIntl(<LoadingBolt theme="dark" />)
  it('should show defaults', () => {
    expect(el.find(Isvg).props().src).toContain(cloudboltIcon)
    expect(el.text()).toContain('loading')
  })
})
