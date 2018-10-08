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
  LightningInvoiceInput,
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
  .add('Lightning Invoice Textarea', () => (
    <React.Fragment>
      <Box my={4}>
        <Box>
          <Label htmlFor="testnet">Bitcoin or Lightning address (testnet)</Label>
        </Box>
        <Form id="testnet">
          <LightningInvoiceInput
            chain="bitcoin"
            network="testnet"
            field="testnet"
            id="testnet"
            validateOnBlur
            validateOnChange
          />
        </Form>
      </Box>
      <Box>
        <Box>
          <Label htmlFor="mainnet">Bitcoin or Lightning address (mainnet)</Label>
        </Box>
        <Form id="testnet">
          <LightningInvoiceInput
            chain="bitcoin"
            network="mainnet"
            field="mainnet"
            id="mainnet"
            validateOnBlur
            validateOnChange
          />
        </Form>
      </Box>
    </React.Fragment>
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
              <Box my={4}>
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

              <Box my={4}>
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

              <Box my={4}>
                <Box>
                  <Label htmlFor="testnet">Bitcoin or Lightning address (testnet)</Label>
                </Box>
                <LightningInvoiceInput
                  chain="bitcoin"
                  network="testnet"
                  field="testnet"
                  id="testnet"
                  validateOnBlur
                  validateOnChange
                />
              </Box>
              <Box>
                <Box>
                  <Label htmlFor="mainnet">Bitcoin or Lightning address (mainnet)</Label>
                </Box>
                <LightningInvoiceInput
                  chain="bitcoin"
                  network="mainnet"
                  field="mainnet"
                  id="mainnet"
                  validateOnBlur
                  validateOnChange
                />
              </Box>

              <Box my={4}>
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

              <Box my={4}>
                <Box>
                  <Label htmlFor="checkbox1">Example Toggle</Label>
                </Box>
                <Box>
                  <Toggle field="checkbox1" onChange={action('change')} />
                </Box>
              </Box>

              <Box my={4}>
                <Box>
                  <Label htmlFor="slider1">Example Range</Label>
                </Box>
                <Box>
                  <Range field="slider1" onChange={action('change')} />
                </Box>
              </Box>

              <Box my={4}>
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
