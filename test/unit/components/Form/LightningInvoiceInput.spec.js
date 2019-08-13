import React from 'react'
import { Form } from 'informed'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import { dark } from 'themes'
import { LightningInvoiceInput } from 'components/Form'

describe('component.UI.LightningInvoiceInput', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <ThemeProvider theme={dark}>
            <Form>
              <LightningInvoiceInput chain="bitcoin" field="name" network="mainnet" theme={dark} />
            </Form>
          </ThemeProvider>
        </IntlProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
