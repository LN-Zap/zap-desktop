import React from 'react'
import { Dropdown } from 'components/UI'
import renderer from 'react-test-renderer'
import { dark } from 'themes'

const currencies = [
  {
    key: 'btc',
    name: 'BTC',
  },
  {
    key: 'bits',
    name: 'bits',
  },
  {
    key: 'sats',
    name: 'satoshis',
  },
]

const setCurrency = jest.fn()

describe('component.Dropdown', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(<Dropdown activeKey="btc" items={currencies} onClick={setCurrency} theme={dark} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
