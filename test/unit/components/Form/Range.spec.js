import React from 'react'

import { Form } from 'informed'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Range } from 'components/Form'

describe('component.UI.Range', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <Form>
        <Range field="name" />
      </Form>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
