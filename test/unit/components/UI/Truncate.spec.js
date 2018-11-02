import React from 'react'
import renderer from 'react-test-renderer'
import { Truncate } from 'components/UI'

describe('component.UI.Truncate', () => {
  it('should truncate text to 12 chars by default', () => {
    const tree = renderer
      .create(<Truncate text="Lorem ipsum dolor sit amet, consectetur adipiscing elit" />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should truncate test to a specific length when the maxlen parm is provided', () => {
    const tree = renderer
      .create(
        <Truncate text="Lorem ipsum dolor sit amet, consectetur adipiscing elit" maxlen={30} />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
