import React from 'react'
import { IntlProvider } from 'react-intl'
import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Countdown } from 'components/UI'

describe('component.UI.Countdown', () => {
  it('should render correctly with expiry set to a date in the past', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <Countdown offset={new Date('2009-01-03T18:15:05+00:00')} />
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
