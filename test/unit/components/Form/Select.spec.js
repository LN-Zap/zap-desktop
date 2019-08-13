import React from 'react'
import { Form } from 'informed'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import { dark } from 'themes'
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
    const tree = renderer
      .create(
        <IntlProvider locale="en">
          <ThemeProvider theme={dark}>
            <Form>
              <Select field="name" items={selectItems} />
            </Form>
          </ThemeProvider>
        </IntlProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
