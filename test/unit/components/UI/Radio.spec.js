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
              <Radio description="Radio buttons" label="Item 1" value="item1" />
              <Radio description="can have an optional title" label="Item 2" value="item2" />
              <Radio description="and description" label="Item 3" value="item3" />
            </RadioGroup>
          </Form>
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
