import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { ActionBar } from 'components/UI'

describe('component.UI.ActionBar', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <ActionBar
        buttons={[
          { name: 'Save', onClick: () => {} },
          { name: 'Cancel', onClick: () => {} },
        ]}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
