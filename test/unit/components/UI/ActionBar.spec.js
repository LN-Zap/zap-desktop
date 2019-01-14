import React from 'react'
import renderer from 'react-test-renderer'
import { ActionBar } from 'components/UI'

describe('component.UI.ActionBar', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ActionBar
          isOpen
          buttons={[{ name: 'Save', onClick: () => {} }, { name: 'Cancel', onClick: () => {} }]}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
