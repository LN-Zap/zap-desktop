import React from 'react'
import Text from 'components/UI/Text'
import renderer from 'react-test-renderer'

describe('component.UI.Text', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Text />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
