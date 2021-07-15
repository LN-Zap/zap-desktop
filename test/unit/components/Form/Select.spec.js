import React from 'react'

import { Form } from 'informed'
import { IntlProvider } from 'react-intl'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Select } from 'components/Form'

describe('component.UI.Toggle', () => {
  it('should render correctly', () => {
    const selectItems = [
      { value: '- Please select -', key: '' },
      { value: 'Apple', key: 'apple' },
      { value: 'Pear', key: 'pear' },
      { value: 'Orange', key: 'orange' },
      { value: 'Grape', key: 'grape' },
      { value: 'Banana', key: 'banana' },
    ]
    const tree = renderWithTheme(
      <IntlProvider locale="en">
        <Form>
          <Select field="name" items={selectItems} />
        </Form>
      </IntlProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
