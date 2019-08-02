import React from 'react'
import { Form } from 'informed'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import { dark } from 'themes'
import { NodePubkeyInput } from 'components/UI'

describe('component.UI.NodePubkeyInput', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <ThemeProvider theme={dark}>
            <Form>
              <NodePubkeyInput field="name" theme={dark} />
            </Form>
          </ThemeProvider>
        </IntlProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
