import React from 'react'
import { Form } from 'informed'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { dark } from 'themes'
import { Input } from 'components/UI'

describe('component.UI.Input', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={dark}>
          <Form>
            <Input field="name" theme={dark} />
          </Form>
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
