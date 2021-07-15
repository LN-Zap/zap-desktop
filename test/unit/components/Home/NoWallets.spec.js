import React from 'react'

import { IntlProvider } from 'react-intl'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import NoWallets from 'components/Home/NoWallets'

const history = { push: jest.fn() }

describe('component.NoWallets', () => {
  it('should render correctly (no wallets)', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <NoWallets history={history} wallets={[]} />
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly (no selected wallet)', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <NoWallets history={history} wallets={[{ name: 'wallet 1' }]} />
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
