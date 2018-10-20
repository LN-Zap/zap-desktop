import React from 'react'
import { Form } from 'informed'
import renderer from 'react-test-renderer'
import { dark } from 'themes'
import { ThemeProvider } from 'styled-components'
import { Select } from 'components/UI'

describe('component.UI.Toggle', () => {
  it('should render correctly', () => {
    const selectItems = [
      { label: '- Please select -', value: '' },
      { label: 'Apple', value: 'apple' },
      { value: 'pear' },
      { value: 'orange' },
      { value: 'grape' },
      { value: 'banana' }
    ]
    const tree = renderer
      .create(
        <ThemeProvider theme={dark}>
          <Form>
            <Select field="name" items={selectItems} />
          </Form>
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
