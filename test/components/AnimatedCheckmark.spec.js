import React from 'react'
import { shallow } from 'enzyme'
import Isvg from 'react-inlinesvg'

import AnimatedCheckmark from '../../app/components/AnimatedCheckmark'
import checkmarkIcon from '../../app/components/AnimatedCheckmark/checkmark.svg'

describe('component.AnimatedCheckmark', () => {
  describe('default', () => {
    it('should render default component', () => {
      const el = shallow(<AnimatedCheckmark />)
      expect(el.find(Isvg).props().src).toContain(checkmarkIcon)
    })
  })
})
