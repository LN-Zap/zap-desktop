import React from 'react'
import renderer from 'react-test-renderer'
import { Link } from 'components/UI'

describe('component.UI.Link', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Link>Link text</Link>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
