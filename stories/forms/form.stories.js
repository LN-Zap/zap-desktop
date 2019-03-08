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
  NodePubkeyInput,
  MainContent,
  Page,
  Radio,
  RadioGroup,
  Range,
  Select,
  TextArea,
  Toggle,
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
  { value: 'Banana', key: 'banana' },
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
          description="This field also has a description."
          field="fieldName"
          id="field-name"
          label="Field with Label and description"
        />
      </Form>
      <Form mb={4}>
        <Input
          field="fieldName"
          id="field-name"
          isRequired
          label="Required field"
          validateOnBlur
          validateOnChange
        />
      </Form>
      <Form mb={4}>
        <Input field="fieldName" id="field-name" label="Search field" type="search" />
      </Form>
      <Form mb={4}>
        <Input field="fieldName" id="field-name" label="Password field" type="password" />
      </Form>
      <Form mb={4}>
        <Input field="fieldName" id="field-name" isDisabled label="Disabled field" />
      </Form>
      <Form mb={4}>
        <Input
          field="fieldName"
          id="field-name"
          initialValue="This is a read only field"
          isReadOnly
          label="Read only field"
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
          description="This field also has a description."
          field="fieldName"
          id="field-name"
          label="TextArea with Label and description"
        />
      </Form>
      <Form mb={4}>
        <TextArea
          field="fieldName"
          id="field-name"
          isRequired
          label="Required field"
          validateOnBlur
          validateOnChange
        />
      </Form>
      <Form mb={4}>
        <TextArea field="fieldName" id="field-name" isDisabled label="Disabled field" />
      </Form>
      <Form mb={4}>
        <TextArea
          field="fieldName"
          id="field-name"
          initialValue="This is a read only field"
          isReadOnly
          label="Read only field"
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
        <CryptoAmountInput currency="btc" field="cryptoBtc" label="BTC" width={150} />
      </Box>

      <Box my={4}>
        <CryptoAmountInput currency="bits" field="cryptoBits" label="Bits" width={150} />
      </Box>

      <Box my={4}>
        <CryptoAmountInput currency="sats" field="cryptoSats" label="Sats" width={150} />
      </Box>
    </Form>
  ))
  .add('FiatAmountInput', () => (
    <Form>
      <Box my={4}>
        <FiatAmountInput currency="usd" field="fiat" label="USD" width={150} />
      </Box>
    </Form>
  ))
  .add('Lightning Invoice', () => (
    <React.Fragment>
      <Box my={4}>
        <Form id="testnet">
          <LightningInvoiceInput
            chain="bitcoin"
            field="testnet"
            id="testnet"
            label="Bitcoin or Lightning address (testnet)"
            network="testnet"
            validateOnBlur
            validateOnChange
          />
        </Form>
      </Box>
      <Box>
        <Form id="testnet">
          <LightningInvoiceInput
            chain="bitcoin"
            field="mainnet"
            id="mainnet"
            label="Bitcoin or Lightning address (mainnet)"
            network="mainnet"
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
  .add('Node Pubkey', () => (
    <Box>
      <Form>
        <NodePubkeyInput
          field="pubkey"
          id="pubkey"
          label="Node Pubkey"
          validateOnBlur
          validateOnChange
        />
      </Form>
    </Box>
  ))
  .add('Select', () => (
    <Form>
      <Select field="fieldName" items={selectItems} />
    </Form>
  ))
  .add('Radio', () => (
    <Form>
      <RadioGroup field="radio">
        <Radio description="Radio buttons" label="Item 1" mb={3} value="item1" />
        <Radio description="can have an optional title" label="Item 2" mb={3} value="item2" />
        <Radio description="and description" label="Item 3" mb={3} value="item3" />
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
      <Range field="range" initialValue={25} />
    </Form>
  ))
  .add('Checkbox', () => (
    <Form>
      <Label htmlFor="checkbox">Unchecked</Label>
      <Checkbox description="Lightning is a layer 2 scaling solution" field="checkbox" />
      <Label htmlFor="checkbox2" mt={4}>
        Checked
      </Label>
      <Checkbox
        field="checkbox2"
        isChecked
        label="I agree that Zap is the best lightning wallet"
        mt={2}
      />
      <Label htmlFor="checkbox3" mt={4}>
        Disabled
      </Label>
      <Checkbox
        field="checkbox3"
        isChecked
        isDisabled
        label="I agree that Zap is the best lightning wallet"
        mt={2}
      />
      <Label htmlFor="checkbox4" mt={4}>
        With description
      </Label>
      <Checkbox
        description="Lightning is a layer 2 scaling solution"
        field="checkbox4"
        label="I agree that Zap is the best lightning wallet"
        mt={2}
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
                  label="Example TextArea"
                  placeholder="Type here"
                  validate={validate}
                  validateOnBlur
                  validateOnChange
                />
              </Box>

              <Box my={4}>
                <LightningInvoiceInput
                  chain="bitcoin"
                  field="testnet"
                  id="testnet"
                  label="Bitcoin or Lightning address (testnet)"
                  network="testnet"
                  validateOnBlur
                  validateOnChange
                />
              </Box>
              <Box>
                <LightningInvoiceInput
                  chain="bitcoin"
                  field="mainnet"
                  id="mainnet"
                  label="Bitcoin or Lightning address (mainnet)"
                  network="mainnet"
                  validateOnBlur
                  validateOnChange
                />
              </Box>

              <Box my={4}>
                <NodePubkeyInput
                  field="pubkey"
                  id="pubkey"
                  label="Node Pubkey"
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
                  <Radio description="Radio buttons" label="Item 1" mb={3} value="item1" />
                  <Radio
                    description="can have an optional title"
                    label="Item 2"
                    mb={3}
                    value="item2"
                  />
                  <Radio description="and description" label="Item 3" mb={3} value="item3" />
                </RadioGroup>
              </Box>

              <Box my={4}>
                <Box>
                  <Label htmlFor="checkbox1" mb={2}>
                    Example Toggle
                  </Label>
                </Box>
                <Box>
                  <Toggle field="checkbox1" label="Example Toggle" onChange={action('change')} />
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
                    field="checkbox2"
                    label="I agree that Zap is the best lightning wallet"
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
