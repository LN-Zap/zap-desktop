import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Form, Radio, RadioGroup } from 'components/Form'

describe('component.UI.Radio', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <Form>
        <RadioGroup field="radio">
          <Radio description="Radio buttons" label="Item 1" value="item1" />
          <Radio description="can have an optional title" label="Item 2" value="item2" />
          <Radio description="and description" label="Item 3" value="item3" />
        </RadioGroup>
      </Form>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
