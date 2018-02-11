import React from 'react'
import { mount } from 'enzyme'
import _ from 'lodash'

import AmountInput from '../../../app/components/Form/AmountInput'

const defaultProps = {
  amount: '',
  currency: '',
  crypto: '',

  onChange: () => {},
}

describe('AmountInput', () => {
  describe('render', () => {
    const props = { ...defaultProps, amount: '0.1234' }
    const el = mount(<AmountInput {...props} />)

    it('renders amount', () => {
      console.log(el.find('input').html())
      expect(el.find('input').get(0).value).toEqual('0.1234')
    })
  })

  describe('shiftValue', () => {
    const cases = [
      ['Up arrow', 1, [
        ['0', '1'],
        ['1', '2'],
        ['9', '10'],

        ['0.0', '0.1'],
        ['0.9', '1.0'],
        ['1.0', '1.1'],
        ['9.9', '10.0'],

        ['0.00', '0.01'],
        ['0.09', '0.10'],
        ['0.99', '1.00'],
        ['1.00', '1.01'],
        ['9.99', '10.00'],
      ]],
      ['Down arrow', -1, [
        ['0', '0'],
        ['1', '0'],
        ['10', '9'],

        ['0.0', '0.0'],
        ['0.1', '0.0'],
        ['1.0', '0.9'],
        ['1.1', '1.0'],
        ['10.0', '9.9'],

        ['0.00', '0.00'],
        ['0.01', '0.00'],
        ['1.00', '0.09'],
        ['1.01', '1.00'],
        ['10.00', '9.09'],
      ]],
    ]

    const component = mount(<AmountInput {...defaultProps} />).instance()

    cases.forEach(([arrow, delta, deltaCases]) => {
      describe(arrow, () => {
        deltaCases.forEach(([from, to]) => {
          it(`Goes from ${from} to ${to}`, () => {
            expect(component.shiftValue(from, delta)).toEqual(to)
          })
        })
      })
    })

  })

  describe('handleKeyDown', () => {
  })
})
