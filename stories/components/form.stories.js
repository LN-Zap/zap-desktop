import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Box } from 'rebass'
import { Form } from 'informed'
import {
  Page,
  MainContent,
  Input,
  Label,
  Select,
  TextArea,
  Button,
  Toggle,
  Range
} from 'components/UI'

const validate = value => {
  return !value || value.length < 5 ? 'Field must be at least five characters' : null
}

const selectItems = [
  { label: '- Please select -', value: '' },
  { label: 'Apple', value: 'apple' },
  { value: 'pear' },
  { value: 'orange' },
  { value: 'grape' },
  { value: 'banana' }
]

storiesOf('Components.Form', module)
  .add('Input', () => (
    <Form>
      <Input field="fieldName" id="field-name" />
    </Form>
  ))
  .add('Label', () => (
    <Form>
      <Label htmlFor="id">Label</Label>
    </Form>
  ))
  .add('TextArea', () => (
    <Form>
      <TextArea field="fieldName" placeholder="Type here" />
    </Form>
  ))
  .add('Select', () => (
    <Form>
      <Select field="fieldName" items={selectItems} />
    </Form>
  ))
  .add('Toggle', () => (
    <Form>
      <Toggle field="checkbox" />
    </Form>
  ))
  .add('Range', () => (
    <Form>
      <Range field="range" />
    </Form>
  ))
  .add('Example form', () => (
    <Page>
      <MainContent>
        <Form>
          {({ formState }) => (
            <React.Fragment>
              <Box mb={3}>
                <Box>
                  <Label htmlFor="input1">Example Field</Label>
                </Box>
                <Box>
                  <Input
                    field="input1"
                    id="field-name"
                    placeholder="Type here"
                    validate={validate}
                    validateOnBlur
                  />
                </Box>
              </Box>

              <Box mb={3}>
                <Box>
                  <Label htmlFor="textarea1">Example Textarea</Label>
                </Box>
                <Box>
                  <TextArea
                    field="textarea1"
                    placeholder="Type here"
                    validate={validate}
                    validateOnBlur
                  />
                </Box>
              </Box>

              <Box mb={3}>
                <Box>
                  <Label htmlFor="selectfield1">Example Select</Label>
                </Box>
                <Box>
                  <Select
                    field="selectfield1"
                    items={selectItems}
                    onChange={action('change')}
                    validate={validate}
                    validateOnBlur
                  />
                </Box>
              </Box>

              <Box mb={3}>
                <Box>
                  <Label htmlFor="checkbox1">Example Toggle</Label>
                </Box>
                <Box>
                  <Toggle field="checkbox1" onChange={action('change')} />
                </Box>
              </Box>

              <Box mb={3}>
                <Box>
                  <Label htmlFor="slider1">Example Range</Label>
                </Box>
                <Box>
                  <Range field="slider1" onChange={action('change')} />
                </Box>
              </Box>

              <Box mb={3}>
                <Button>Submit</Button>
              </Box>

              <Box bg="lightestBackground">
                <pre>{JSON.stringify(formState, null, 2)}</pre>
              </Box>
            </React.Fragment>
          )}
        </Form>
      </MainContent>
    </Page>
  ))
