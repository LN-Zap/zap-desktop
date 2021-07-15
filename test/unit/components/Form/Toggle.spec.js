import React from 'react'

import { Form } from 'informed'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Toggle } from 'components/Form'

describe('component.UI.Toggle', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <Form>
        <Toggle field="name" />
      </Form>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
