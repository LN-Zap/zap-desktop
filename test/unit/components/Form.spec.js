import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Form from 'components/Form'
import Pay from 'containers/Pay'
import Request from 'containers/Request'

configure({ adapter: new Adapter() })

const defaultProps = {
  formType: '',
  closeForm: () => {}
}

describe('Form', () => {
  describe('should show pay form when formType is PAY_FORM', () => {
    const props = { ...defaultProps, formType: 'PAY_FORM' }
    const el = shallow(<Form {...props} />)
    it('should contain Pay', () => {
      expect(el.find(Pay)).toHaveLength(1)
    })
  })

  describe('should show request form when formType is REQUEST_FORM', () => {
    const props = { ...defaultProps, formType: 'REQUEST_FORM' }
    const el = shallow(<Form {...props} />)
    it('should contain Request', () => {
      expect(el.find(Request)).toHaveLength(1)
    })
  })
})
