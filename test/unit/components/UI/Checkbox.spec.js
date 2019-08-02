import React from 'react'
import renderer from 'react-test-renderer'
import { Form } from 'informed'
import { ThemeProvider } from 'styled-components'
import { Checkbox } from 'components/UI'
import { dark } from 'themes'

describe('component.UI.Checkbox', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={dark}>
          <Form>
            <Checkbox field="name" label="cb" />
            <Checkbox description="desc" field="name2" label="cb" />
          </Form>
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
