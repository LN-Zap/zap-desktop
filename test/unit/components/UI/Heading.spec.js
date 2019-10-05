import React from 'react'
import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Heading } from 'components/UI'

describe('component.UI.Heading', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Heading>Heading here</Heading>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('Heading.{h1|h2|h3|h4|h5|h6}', () => {
    it(`should render a heading of the correct level`, () => {
      for (var i = 1; i <= 6; i++) {
        const Element = Heading[`h${i}`]
        const testRenderer = renderWithTheme(<Element>Heading here</Element>)
        expect(testRenderer.root.findByType(`h${i}`)).toBeTruthy()
      }
    })
  })
})
