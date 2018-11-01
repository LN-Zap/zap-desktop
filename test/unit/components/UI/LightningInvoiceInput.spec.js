import React from 'react'
import { Form } from 'informed'
import renderer from 'react-test-renderer'
import { dark } from 'themes'
import { ThemeProvider } from 'styled-components'
import { LightningInvoiceInput } from 'components/UI'
import { IntlProvider } from 'react-intl'

describe('component.UI.LightningInvoiceInput', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <IntlProvider>
          <ThemeProvider theme={dark}>
            <Form>
              <LightningInvoiceInput field="name" chain="bitcoin" network="mainnet" theme={dark} />
            </Form>
          </ThemeProvider>
        </IntlProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
