import React from 'react'

import { Form } from 'informed'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Checkbox } from 'components/Form'

describe('component.UI.Checkbox', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <Form>
        <Checkbox field="name" label="cb" />
        <Checkbox description="desc" field="name2" label="cb" />
      </Form>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
