import React from 'react'

import { IntlProvider } from 'react-intl'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Dropdown } from 'components/UI'
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

const setCryptoUnit = jest.fn()

describe('component.Dropdown', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <Dropdown activeKey="btc" items={currencies} onClick={setCryptoUnit} theme={dark} />
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
