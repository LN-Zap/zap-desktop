import React from 'react'
import { IntlProvider } from 'react-intl'
import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Countdown } from 'components/UI'

describe('component.UI.Countdown', () => {
  it('should render correctly with default props', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <Countdown offset={new Date(Date.UTC('2009-01-03T18:15:05+00:00'))} />
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
