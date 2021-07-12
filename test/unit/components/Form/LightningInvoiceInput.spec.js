import React from 'react'

import { Form } from 'informed'
import { IntlProvider } from 'react-intl'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { LightningInvoiceInput } from 'components/Form'

describe('component.UI.LightningInvoiceInput', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <Form>
          <LightningInvoiceInput chain="bitcoin" field="name" network="mainnet" />
        </Form>
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
