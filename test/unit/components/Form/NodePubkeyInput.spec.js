import React from 'react'

import { Form } from 'informed'
import { IntlProvider } from 'react-intl'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { NodePubkeyInput } from 'components/Form'

describe('component.UI.NodePubkeyInput', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <Form>
          <NodePubkeyInput field="name" />
        </Form>
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
