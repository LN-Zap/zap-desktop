import React from 'react'

import { Form } from 'informed'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { TextArea } from 'components/Form'

describe('component.UI.Input', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <Form>
        <TextArea field="name" />
      </Form>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
