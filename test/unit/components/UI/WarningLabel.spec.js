import React from 'react'
import renderer from 'react-test-renderer'
import { WarningLabel } from 'components/UI'

describe('component.UI.WarningLabel', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<WarningLabel />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
