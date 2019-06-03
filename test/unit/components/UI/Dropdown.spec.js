import React from 'react'
import { Dropdown } from 'components/UI'
import renderer from 'react-test-renderer'
import { IntlProvider } from 'react-intl'
import { dark } from 'themes'

const currencies = [
  {
    key: 'btc',
    value: 'BTC',
  },
  {
    key: 'bits',
    value: 'bits',
  },
  {
    key: 'sats',
    value: 'satoshis',
  },
]

const setCurrency = jest.fn()

describe('component.Dropdown', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <Dropdown activeKey="btc" items={currencies} onClick={setCurrency} theme={dark} />
        </IntlProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
