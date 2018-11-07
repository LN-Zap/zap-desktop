import React from 'react'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { AmountInput } from 'components/UI'

configure({ adapter: new Adapter() })

let component
let wrapped
let input

const defaultProps = {
  amount: '',
  currency: '',

  onChange: () => {}
}

const mountInput = props => {
  wrapped = mount(<AmountInput {...defaultProps} {...props} />)
  input = wrapped.find('input')
  component = wrapped.instance()
}

describe('AmountInput', () => {
  describe('render', () => {
    it('renders amount', () => {
      mountInput({ amount: '0.1234' })
      expect(input.props().value).toEqual('0.1234')
    })
  })

  describe('input properties', () => {
    it('passes readOnly to input', () => {
      mountInput({ readOnly: true })
      expect(input.props().readOnly).toEqual(true)
    })
  })

  describe('parseNumber', () => {
    const test = (from, to) => {
      expect(component.parseNumber(from)).toEqual(to)
    }
    beforeEach(() => mountInput())

    it('splits number into integer and fraction', () => {
      test(null, ['', null])
      test('', ['', null])
      test('0', ['0', null])
      test('00', ['00', null])
      test('0.', ['0', ''])

      test('1', ['1', null])
      test('01', ['01', null])
      test('1.', ['1', ''])

      test('0.0', ['0', '0'])
      test('0.1', ['0', '1'])

      test('0.01', ['0', '01'])
      test('0.10', ['0', '10'])

      test('1.0', ['1', '0'])
      test('01.0', ['01', '0'])
    })

    describe('bitcoin', () => {
      beforeEach(() => {
        let props = { ...defaultProps, currency: 'btc' }
        component = mount(<AmountInput {...props} />).instance()
      })
      it('has a precision of 8', () => {
        test('1.1', ['1', '1'])
        test('1.12', ['1', '12'])
        test('1.123', ['1', '123'])
        test('1.1234', ['1', '1234'])
        test('1.12345', ['1', '12345'])
        test('1.123456', ['1', '123456'])
        test('1.1234567', ['1', '1234567'])
        test('1.12345678', ['1', '12345678'])
        test('1.123456789', ['1', '12345678'])
        test('1.1234567890', ['1', '12345678'])
      })
    })

    describe('bits', () => {
      beforeEach(() => {
        let props = { ...defaultProps, currency: 'bits' }
        component = mount(<AmountInput {...props} />).instance()
      })
      it('has a precision of 2', () => {
        test('1.1', ['1', '1'])
        test('1.12', ['1', '12'])
        test('1.123', ['1', '12'])
        test('1.1234', ['1', '12'])
      })
    })

    describe('sats', () => {
      beforeEach(() => {
        let props = { ...defaultProps, currency: 'sats' }
        component = mount(<AmountInput {...props} />).instance()
      })
      it('has a precision of 0', () => {
        test('1.1', ['1', ''])
        test('1.12', ['1', ''])
      })
    })
  })

  describe('formatValue', () => {
    const component = mount(<AmountInput {...defaultProps} />).instance()
    const test = (from, to) => {
      expect(component.formatValue(from[0], from[1])).toEqual(to)
    }

    it('turns parsed number into a string', () => {
      test(['0', null], '0')
      test(['00', null], '00')
      test(['0', ''], '0.')

      test(['1', null], '1')
      test(['01', null], '01')
      test(['1', ''], '1.')

      test(['0', '0'], '0.0')
      test(['0', '1'], '0.1')

      test(['0', '01'], '0.01')
      test(['0', '10'], '0.10')

      test(['1', '0'], '1.0')
      test(['01', '0'], '01.0')
    })
  })

  describe('handleChange', () => {
    let onChangeEvent
    let component
    beforeEach(() => {
      onChangeEvent = jest.fn()
      let props = { ...defaultProps, onChangeEvent }
      component = mount(<AmountInput {...props} />).instance()
    })

    it('sends value to parseNumber', () => {
      jest.spyOn(component, 'parseNumber')

      component.handleChange({ target: { value: '123.0' } })
      expect(component.parseNumber).toHaveBeenCalledTimes(1)
      expect(component.parseNumber).toHaveBeenCalledWith('123.0')
    })

    it('calls formatValue with presult from parseNumber', () => {
      jest.spyOn(component, 'formatValue')

      component.handleChange({ target: { value: '123.0' } })
      expect(component.formatValue).toHaveBeenCalledTimes(1)
      expect(component.formatValue).toHaveBeenCalledWith('123', '0')
    })

    it('calls props.onChange with formatValue result', () => {
      jest.spyOn(component, 'formatValue').mockReturnValue('456')

      component.handleChange({ target: { value: '123.0' } })
      expect(onChangeEvent).toHaveBeenCalledWith('456')
    })
  })

  describe('handleBlur', () => {
    let onBlurEvent
    let component
    beforeEach(() => {
      onBlurEvent = jest.fn()
      let props = { ...defaultProps, onBlurEvent }
      component = mount(<AmountInput {...props} />).instance()
    })

    it('calls props.onBlurEvent with formatValue result', () => {
      jest.spyOn(component, 'formatValue').mockReturnValue('456')

      component.handleBlur({ target: { value: '123.0' } })
      expect(onBlurEvent).toHaveBeenCalledWith('456')
    })
  })

  describe('handleKeyDown', () => {
    let event
    let preventDefault

    beforeEach(() => {
      wrapped = mount(<AmountInput {...defaultProps} />)
      component = wrapped.instance()

      preventDefault = jest.fn()
    })

    describe('dot', () => {
      beforeEach(() => {
        wrapped = mount(<AmountInput {...defaultProps} />)
        component = wrapped.instance()
        preventDefault = jest.fn()

        event = {
          key: '.',
          target: { value: '123' },
          preventDefault
        }
      })

      it('allows adding dot to a number that has no dot', () => {
        component.handleKeyDown({ ...event, target: { value: '123' } }) // no dot
        expect(preventDefault).not.toHaveBeenCalled()
      })

      it('does not allow multiple dots in the number', () => {
        component.handleKeyDown({ ...event, target: { value: '123.' } }) // has a dot
        expect(preventDefault).toHaveBeenCalled()
      })
    })

    describe('Non-supported keys', () => {
      beforeEach(() => {
        wrapped = mount(<AmountInput {...defaultProps} />)
        component = wrapped.instance()
        preventDefault = jest.fn()

        event = {
          key: '.',
          target: { value: '123' },
          preventDefault
        }
      })

      it('prevents event', () => {
        component.handleKeyDown({ ...event, key: 'b' })
        expect(preventDefault).toHaveBeenCalled()

        component.handleKeyDown({ ...event, key: 'B' })
        expect(preventDefault).toHaveBeenCalled()

        component.handleKeyDown({ ...event, key: '-' })
        expect(preventDefault).toHaveBeenCalled()

        component.handleKeyDown({ ...event, key: '?' })
        expect(preventDefault).toHaveBeenCalled()
      })
    })
  })
})
