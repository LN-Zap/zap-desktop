import React from 'react'
import renderer from 'react-test-renderer'
import { Checkbox } from 'components/UI'
import { Form } from 'informed'
import { dark } from 'themes'
import { ThemeProvider } from 'styled-components'

describe('component.UI.Checkbox', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={dark}>
          <Form>
            <Checkbox field="name" label="cb" />
            <Checkbox field="name2" label="cb" description="desc" />
          </Form>
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
