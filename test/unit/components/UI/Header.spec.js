import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Header } from 'components/UI'

describe('component.UI.Header', () => {
  it('should render correctly with default props', () => {
    const wrapper = renderWithTheme(<Header />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly with title', () => {
    const wrapper = renderWithTheme(<Header title="title here" />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly with subtitle', () => {
    const wrapper = renderWithTheme(<Header subtitle="subtitle here" />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly with logo', () => {
    const wrapper = renderWithTheme(<Header logo="logo here" />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly with title, subtitle, and logo', () => {
    const wrapper = renderWithTheme(
      <Header logo="logo here" subtitle="logo here" title="title here" />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
