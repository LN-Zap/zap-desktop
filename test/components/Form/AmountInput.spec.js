import React from 'react'
import { mount } from 'enzyme'
import _ from 'lodash'

import AmountInput from '../../../app/components/Form/AmountInput'

  let component;
  let wrapped;

  const defaultProps = {
    amount: '',
    currency: '',
    crypto: '',

    onChange: () => {}
  }

describe('AmountInput', () => {
  describe('render', () => {
    const props = { ...defaultProps, amount: '0.1234' }
    const el = mount(<AmountInput {...props} />)

    it('renders amount', () => {
      expect(el.find('input').get(0).value).toEqual('0.1234')
    })
  })

  describe('parseNumber', () => {
    const test = (from, to) => {
      expect(component.parseNumber(from)).toEqual(to)
    }
    beforeEach(() => {
      component = mount(<AmountInput {...defaultProps} />).instance()
    })

    it('splits number into integer and fraction', () => {
      test('', ['0', null])
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

  describe('shiftValue', () => {

    describe('inrcements', () => {
      const component = mount(<AmountInput {...defaultProps} />).instance()
      const test = (from, to) => {
        expect(component.shiftValue(from, 1)).toEqual(to)
      }

      it('increments decimal values', () => {
        test('0', '1')
        test('1', '2')
        test('9', '10')
      })

      it('increments values with one fractional place', () => {
        test('0.0', '0.1')
        test('0.9', '1.0')
        test('1.0', '1.1')
        test('9.9', '10.0')
      })

      it('increments values with two fractional places', () => {
        test('0.00', '0.01')
        test('0.09', '0.10')
        test('0.99', '1.00')
        test('1.00', '1.01')
        test('9.99', '10.00')
      })

      it('increments values in satoshis', () => {
        test('0.00000000', '0.00000001')
        test('0.00000009', '0.00000010')
      })
    })
      
    describe('decrements', () => {
      const component = mount(<AmountInput {...defaultProps} />).instance()
      const test = (from, to) => {
        expect(component.shiftValue(from, -1)).toEqual(to)
      }
      it('decrements decimal values', () => {
        test('0', '0')
        test('1', '0')
        test('10', '9')
      })

      it('decrements decimal values with one fractional place', () => {
        test('0.0', '0.0')
        test('0.1', '0.0')
        test('1.0', '0.9')
        test('1.1', '1.0')
        test('10.0', '9.9')
      })

      it('decrements decimal values with two fractional places', () => {
        test('0.00', '0.00')
        test('0.01', '0.00')
        test('0.10', '0.09')
        test('1.00', '0.99')
        test('1.01', '1.00')
        test('10.00', '9.99')
      })

      it('decrements values in satoshis', () => {
        test('0.00000000', '0.00000000')
        test('0.00000001', '0.00000000')
        test('0.00000010', '0.00000009')
      })
    })
  })

  describe('handleChange', () => {
    let onChange
    let component
    beforeEach(() => {
      onChange = jest.fn()
      let props = {...defaultProps, onChange}
      component = mount(<AmountInput {...props} />).instance()
    })

    it('sends value to parseNumber', () => {
      spyOn(component, 'parseNumber').and.returnValue([0, 0]); 

      component.handleChange({target: { value: '123.0' }})
      expect(component.parseNumber.calls.count()).toEqual(1)
      expect(component.parseNumber.calls.argsFor(0)).toEqual(['123.0'])
    })

    it('calls formatValue with presult from parseNumber', () => {
      spyOn(component, 'formatValue').and.callThrough(); 

      component.handleChange({target: { value: '123.0' }})
      expect(component.formatValue.calls.count()).toEqual(1)
      expect(component.formatValue.calls.argsFor(0)).toEqual(['123', '0'])
    })

    it('calls props.onChange with formatValue result', () => {
      spyOn(component, 'formatValue').and.returnValue('456')

      component.handleChange({target: { value: '123.0' }})
      expect(onChange).toHaveBeenCalledWith('456')
    })
  })

  describe('handleKeyDown', () => {
    let event;
    let preventDefault;

    beforeEach(() => {
      wrapped = mount(<AmountInput {...defaultProps} />)
      component = wrapped.instance()
      spyOn(component, 'shiftValue')

      preventDefault = jest.fn()

      event = {
        key: 'ArrowUp',
        target: { value: '123' },
        preventDefault,
      }
    })

    describe('ArrowUp', () => {
      it('calls shiftValue with delta = 1', () => {
        component.handleKeyDown({...event, key: 'ArrowUp' })
        expect(component.shiftValue).toHaveBeenCalledWith('123', 1)
      })

      it('calls preventDefault', () => {
        component.handleKeyDown({...event, key: 'ArrowUp' })
        expect(preventDefault).toHaveBeenCalled()
      })
    })

    describe('ArrowDown', () => {
      it('calls shiftValue with delta = -1', () => {
        component.handleKeyDown({...event, key: 'ArrowDown' })
        expect(component.shiftValue).toHaveBeenCalledWith('123', -1)
      })

      it('calls preventDefault', () => {
        component.handleKeyDown({...event, key: 'ArrowDown' })
        expect(preventDefault).toHaveBeenCalled()
      })
    })

    describe('comma and dot', () => {
      beforeEach(() => {
        wrapped = mount(<AmountInput {...defaultProps} />)
        component = wrapped.instance()
        preventDefault = jest.fn()

        event = {
          key: '.',
          target: { value: '123' },
          preventDefault,
        }
      })

      it('allows adding dot to a number that has no dot', () => {
        component.handleKeyDown({...event, target: { value: '123'}}) // no dot
        expect(preventDefault).not.toHaveBeenCalled()

        component.handleKeyDown({...event, key: ',', target: { value: '123'}}) // no dot
        expect(preventDefault).not.toHaveBeenCalled()
      })

      it('does not allow multiple dots in the number', () => {
        component.handleKeyDown({...event, target: { value: '123.'}}) // has a dot
        expect(preventDefault).toHaveBeenCalled()

        component.handleKeyDown({...event, key: ',', target: { value: '123,'}}) // has a dot
        expect(preventDefault).toHaveBeenCalled()
      })
    })

    describe('Non-supported keys', () => {
      it('prevents event', () => {
        component.handleKeyDown({...event, key: 'a'})
        expect(preventDefault).toHaveBeenCalled()

        component.handleKeyDown({...event, key: 'A'})
        expect(preventDefault).toHaveBeenCalled()

        component.handleKeyDown({...event, key: '-'})
        expect(preventDefault).toHaveBeenCalled()

        component.handleKeyDown({...event, key: '?'})
        expect(preventDefault).toHaveBeenCalled()
      })
    })
  })

})
