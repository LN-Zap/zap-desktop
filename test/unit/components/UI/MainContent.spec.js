import React from 'react'
import renderer from 'react-test-renderer'
import { MainContent } from 'components/UI'

describe('component.UI.MainContent', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<MainContent />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
