import React from 'react'
import MainContent from 'components/UI/MainContent'
import renderer from 'react-test-renderer'

describe('component.UI.MainContent', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<MainContent />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
