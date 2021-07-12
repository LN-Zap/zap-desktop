import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Sidebar } from 'components/UI'

describe('component.UI.Sidebar', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Sidebar />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('Sidenbar.{small|medium|large}', () => {
    it(`should render a sidebar of the correct size`, () => {
      const sizes = ['Small', 'Medium', 'Large']
      sizes.forEach(size => {
        const Element = Sidebar[size]
        const wrapper = renderWithTheme(<Element />)
        expect(wrapper.root.find(Sidebar[size])).toBeTruthy()
      })
    })
  })
})
