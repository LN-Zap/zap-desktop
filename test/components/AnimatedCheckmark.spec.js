import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Isvg from 'react-inlinesvg'

import AnimatedCheckmark from '../../app/components/AnimatedCheckmark'
import checkmarkIcon from '../../app/components/AnimatedCheckmark/checkmark.svg'

configure({ adapter: new Adapter() })

describe('component.AnimatedCheckmark', () => {
  describe('default', () => {
    it('should render default component', () => {
      const el = shallow(<AnimatedCheckmark />)
      expect(el.find(Isvg).props().src).toContain(checkmarkIcon)
    })
  })
})
