import React from 'react'
import Dropdown from 'components/UI/Dropdown'
import renderer from 'react-test-renderer'
import { dark } from 'themes'

const currencies = [
  {
    key: 'btc',
    name: 'BTC'
  },
  {
    key: 'bits',
    name: 'bits'
  },
  {
    key: 'sats',
    name: 'satoshis'
  }
]

const setCurrency = jest.fn()

describe('component.Dropdown', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(<Dropdown theme={dark} activeKey="btc" items={currencies} onClick={setCurrency} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
