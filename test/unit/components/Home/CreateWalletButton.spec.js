import React from 'react'

import { IntlProvider } from 'react-intl'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import CreateWalletButton from 'components/Home/CreateWalletButton'

const history = { push: jest.fn() }

describe('component.CreateWalletButton', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <CreateWalletButton history={history} />
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
