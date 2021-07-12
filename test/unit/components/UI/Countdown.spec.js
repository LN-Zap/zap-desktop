import React from 'react'

import { IntlProvider } from 'react-intl'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Countdown } from 'components/UI'

const CURRENT_DATE = 1573466266762

describe('component.UI.Countdown', () => {
  let dateNowMockFn

  beforeEach(() => {
    dateNowMockFn = jest.spyOn(Date, 'now').mockImplementation(() => CURRENT_DATE)
  })

  afterEach(() => {
    dateNowMockFn.mockRestore()
  })

  it('should render correctly with expiry set to a date 1 hour in the past', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <Countdown offset={new Date(1573466266762 - 3600000)} />
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly with expiry in 60 seconds', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <Countdown offset={60} />
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly with expiry in 365 days', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <Countdown offset={86400 * 365} />
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
