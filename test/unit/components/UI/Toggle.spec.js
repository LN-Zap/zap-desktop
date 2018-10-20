import React from 'react'
import { Form } from 'informed'
import renderer from 'react-test-renderer'
import { dark } from 'themes'
import { ThemeProvider } from 'styled-components'
import { Toggle } from 'components/UI'

describe('component.UI.Toggle', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={dark}>
          <Form>
            <Toggle field="name" />
          </Form>
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
