import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Box } from 'rebass'
import {
  CryptoAmountInput,
  FiatAmountInput,
  Page,
  MainContent,
  Form,
  Input,
  Label,
  LightningInvoiceInput,
  Select,
  TextArea,
  Button,
  Toggle,
  Radio,
  RadioGroup,
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

storiesOf('Forms', module)
  .add('Input', () => (
    <>
      <Form mb={4}>
        <Input field="fieldName" id="field-name" />
      </Form>
      <Form mb={4}>
        <Input field="fieldName" id="field-name" label="Field with Label" />
      </Form>
      <Form mb={4}>
        <Input
          field="fieldName"
          id="field-name"
          label="Field with Label and description"
          description="This field also has a description."
        />
      </Form>
    </>
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
  .add('CryptoAmountInput', () => (
    <Form>
      <Box my={4}>
        <CryptoAmountInput field="cryptoBtc" currency="btc" width={150} label="BTC" />
      </Box>

      <Box my={4}>
        <CryptoAmountInput field="cryptoBits" currency="bits" width={150} label="Bits" />
      </Box>

      <Box my={4}>
        <CryptoAmountInput field="cryptoSats" currency="sats" width={150} label="Sats" />
      </Box>
    </Form>
  ))
  .add('FiatAmountInput', () => (
    <Form>
      <Box my={4}>
        <FiatAmountInput field="fiat" currency="usd" width={150} label="USD" />
      </Box>
    </Form>
  ))
  .add('Lightning Invoice Textarea', () => (
    <React.Fragment>
      <Box my={4}>
        <Form id="testnet">
          <LightningInvoiceInput
            chain="bitcoin"
            network="testnet"
            field="testnet"
            id="testnet"
            label="Bitcoin or Lightning address (testnet)"
            validateOnBlur
            validateOnChange
          />
        </Form>
      </Box>
      <Box>
        <Form id="testnet">
          <LightningInvoiceInput
            chain="bitcoin"
            network="mainnet"
            field="mainnet"
            id="mainnet"
            label="Bitcoin or Lightning address (mainnet)"
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
  .add('Radio', () => (
    <Form>
      <RadioGroup field="radio">
        <Radio value="item1" label="Item 1" description="Radio buttons" />
        <Radio value="item2" label="Item 2" description="can have an optional title" />
        <Radio value="item3" label="Item 3" description="and description" />
      </RadioGroup>
    </Form>
  ))
  .add('Toggle', () => (
    <Form>
      <Toggle field="checkbox" />
    </Form>
  ))
  .add('Range', () => (
    <Form>
      <Range initialValue={25} field="range" />
    </Form>
  ))
  .add('Example form', () => (
    <Page>
      <MainContent>
        <Form>
          {({ formState }) => (
            <React.Fragment>
              <Box my={4}>
                <Input
                  field="input1"
                  id="field-name"
                  label="Example Field"
                  placeholder="Type here"
                  validate={validate}
                  validateOnBlur
                />
              </Box>

              <Box my={4}>
                <TextArea
                  field="textarea1"
                  placeholder="Type here"
                  label="Example TextArea"
                  validate={validate}
                  validateOnBlur
                />
              </Box>

              <Box my={4}>
                <LightningInvoiceInput
                  chain="bitcoin"
                  network="testnet"
                  field="testnet"
                  id="testnet"
                  label="Bitcoin or Lightning address (testnet)"
                  validateOnBlur
                  validateOnChange
                />
              </Box>
              <Box>
                <LightningInvoiceInput
                  chain="bitcoin"
                  network="mainnet"
                  field="mainnet"
                  id="mainnet"
                  label="Bitcoin or Lightning address (mainnet)"
                  validateOnBlur
                  validateOnChange
                />
              </Box>

              <Box my={4}>
                <Box>
                  <Label htmlFor="selectfield1" mb={2}>
                    Example Select
                  </Label>
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
                <RadioGroup field="radio">
                  <Radio value="item1" label="Item 1" description="Radio buttons" />
                  <Radio value="item2" label="Item 2" description="can have an optional title" />
                  <Radio value="item3" label="Item 3" description="and description" />
                </RadioGroup>
              </Box>

              <Box my={4}>
                <Box>
                  <Label htmlFor="checkbox1" mb={2}>
                    Example Toggle
                  </Label>
                </Box>
                <Box>
                  <Toggle field="checkbox1" onChange={action('change')} label="Example Toggle" />
                </Box>
              </Box>

              <Box my={4}>
                <Box>
                  <Label htmlFor="slider1" mb={2}>
                    Example Range
                  </Label>
                </Box>
                <Box>
                  <Range field="slider1" initialValue={25} onChange={action('change')} />
                </Box>
              </Box>

              <Box my={4}>
                <Button>Submit</Button>
              </Box>

              <Box bg="tertiaryColor">
                <pre>{JSON.stringify(formState, null, 2)}</pre>
              </Box>
            </React.Fragment>
          )}
        </Form>
      </MainContent>
    </Page>
  ))
