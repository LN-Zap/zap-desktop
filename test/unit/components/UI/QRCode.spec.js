import React from 'react'
import renderer from 'react-test-renderer'
import { QRCode } from 'components/UI'

describe('component.UI.QRCode', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<QRCode value="qwerty" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
