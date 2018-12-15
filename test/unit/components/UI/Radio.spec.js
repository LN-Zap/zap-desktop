import React from 'react'
import renderer from 'react-test-renderer'
import { dark } from 'themes'
import { ThemeProvider } from 'styled-components'
import { Form, Radio, RadioGroup } from 'components/UI'

describe('component.UI.Radio', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={dark}>
          <Form>
            <RadioGroup field="radio">
              <Radio value="item1" label="Item 1" description="Radio buttons" />
              <Radio value="item2" label="Item 2" description="can have an optional title" />
              <Radio value="item3" label="Item 3" description="and description" />
            </RadioGroup>
          </Form>
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
