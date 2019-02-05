import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Box } from 'rebass'
import {
  Button,
  Checkbox,
  CryptoAmountInput,
  FiatAmountInput,
  Form,
  Input,
  Label,
  LightningInvoiceInput,
  LndConnectionStringInput,
  MainContent,
  Page,
  Radio,
  RadioGroup,
  Range,
  Select,
  TextArea,
  Toggle
} from 'components/UI'

const validate = value => {
  return !value || value.length < 5 ? 'Field must be at least five characters' : null
}

const selectItems = [
  { value: '- Please select -', key: '' },
  { value: 'Apple', key: 'apple' },
  { value: 'Pear', key: 'pear' },
  { value: 'Orange', key: 'orange' },
  { value: 'Grape', key: 'grape' },
  { value: 'Banana', key: 'banana' }
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
      <Form mb={4}>
        <Input
          field="fieldName"
          id="field-name"
          label="Required field"
          required
          validateOnBlur
          validateOnChange
        />
      </Form>
      <Form mb={4}>
        <Input field="fieldName" id="field-name" type="search" label="Search field" />
      </Form>
      <Form mb={4}>
        <Input field="fieldName" id="field-name" type="password" label="Password field" />
      </Form>
      <Form mb={4}>
        <Input field="fieldName" id="field-name" label="Disabled field" disabled />
      </Form>
      <Form mb={4}>
        <Input
          field="fieldName"
          id="field-name"
          label="Read only field"
          readOnly
          initialValue="This is a read only field"
        />
      </Form>
    </>
  ))
  .add('TextArea', () => (
    <>
      <Form mb={4}>
        <TextArea field="fieldName" id="field-name" />
      </Form>
      <Form mb={4}>
        <TextArea field="fieldName" id="field-name" label="TextArea with Label" />
      </Form>
      <Form mb={4}>
        <TextArea
          field="fieldName"
          id="field-name"
          label="TextArea with Label and description"
          description="This field also has a description."
        />
      </Form>
      <Form mb={4}>
        <TextArea
          field="fieldName"
          id="field-name"
          label="Required field"
          required
          validateOnBlur
          validateOnChange
        />
      </Form>
      <Form mb={4}>
        <TextArea field="fieldName" id="field-name" label="Disabled field" disabled />
      </Form>
      <Form mb={4}>
        <TextArea
          field="fieldName"
          id="field-name"
          label="Read only field"
          readOnly
          initialValue="This is a read only field"
        />
      </Form>
    </>
  ))
  .add('Label', () => (
    <Form>
      <Label htmlFor="id">Label</Label>
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
  .add('Lightning Invoice', () => (
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
  .add('Lnd Connection String', () => (
    <Form>
      <LndConnectionStringInput
        field="connectionString"
        id="connectionString"
        label="Connection String"
        validateOnBlur
        validateOnChange
      />
    </Form>
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
  .add('Checkbox', () => (
    <Form>
      <Label htmlFor="id">Unchecked</Label>
      <Checkbox
        label="I agree that Zap is the best lightning wallet"
        field="checkbox"
        description="Lightning is a layer 2 scaling solution"
      />
      <Label htmlFor="id" mt={4}>
        Checked
      </Label>
      <Checkbox
        label="I agree that Zap is the best lightning wallet"
        field="checkbox2"
        mt={2}
        checked
      />
      <Label htmlFor="id" mt={4}>
        Disabled
      </Label>
      <Checkbox
        label="I agree that Zap is the best lightning wallet"
        field="checkbox2"
        mt={2}
        checked
        disabled
      />
      <Label htmlFor="id" mt={4}>
        With description
      </Label>
      <Checkbox
        label="I agree that Zap is the best lightning wallet"
        description="Lightning is a layer 2 scaling solution"
        field="checkbox3"
        mt={2}
        checked
        disabled
      />
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
                  validateOnChange
                />
              </Box>

              <Box my={4}>
                <TextArea
                  field="textarea1"
                  placeholder="Type here"
                  label="Example TextArea"
                  validate={validate}
                  validateOnBlur
                  validateOnChange
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
                <Box>
                  <Label htmlFor="checkbox2" mb={2}>
                    Example Checkbox
                  </Label>
                </Box>
                <Box>
                  <Checkbox
                    label="I agree that Zap is the best lightning wallet"
                    field="checkbox2"
                  />
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
