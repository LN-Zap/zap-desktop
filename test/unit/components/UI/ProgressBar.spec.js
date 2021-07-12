import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { ProgressBar } from 'components/UI'

describe('component.UI.ProgressBar', () => {
  it('should render correctly (default)', () => {
    const tree = renderWithTheme(<ProgressBar />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly (50%)', () => {
    const tree = renderWithTheme(<ProgressBar progress={0.5} />)
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly (100%)', () => {
    const tree = renderWithTheme(<ProgressBar progress={1} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly (right justify)', () => {
    const tree = renderWithTheme(<ProgressBar justify="right" progress={0.5} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly (blue)', () => {
    const tree = renderWithTheme(<ProgressBar color="superBlue" progress={0.5} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
