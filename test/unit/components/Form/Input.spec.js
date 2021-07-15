import React from 'react'

import { Form } from 'informed'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Input } from 'components/Form'

describe('component.UI.Input', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <Form>
        <Input field="name" />
      </Form>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
