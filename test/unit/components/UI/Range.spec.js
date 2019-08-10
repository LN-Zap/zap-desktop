import React from 'react'
import { Form } from 'informed'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { dark } from 'themes'
import { Range } from 'components/UI'

describe('component.UI.Range', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={dark}>
          <Form>
            <Range field="name" />
          </Form>
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
