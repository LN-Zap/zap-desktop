import React from 'react'
import { storiesOf } from '@storybook/react'
import { StateDecorator, Store } from '@sambego/storybook-state'
import { Flex } from 'rebass'
import {
  Button,
  Dropdown,
  Form,
  Input,
  Label,
  LightningInvoiceInput,
  Message,
  Notification,
  Range,
  TextArea,
  Toggle
} from 'components/UI'
import { Column, Group, Element } from './helpers'

const store = new Store({
  crypto: 'btc',
  fiat: 'usd',
  cryptoCurrencies: [
    {
      key: 'btc',
      name: 'BTC'
    },
    {
      key: 'bits',
      name: 'bits'
    },
    {
      key: 'sats',
      name: 'satoshis'
    }
  ],
  fiatCurrencies: [
    {
      key: 'usd',
      name: 'USD'
    },
    {
      key: 'eur',
      name: 'EUR'
    },
    {
      key: 'gbp',
      name: 'GBP'
    }
  ]
})

storiesOf('Welcome', module)
  .addDecorator(StateDecorator(store))
  .addWithChapters('Zap Style Guide', {
    subtitle: 'Reusable components for Zap Desktop.',
    info: `The Zap style guide showcases and documents our library of reusable React components. Below is a sample of
    these components. You can see more examples and full documentation of each component using the navigation on the
    left. Use the Theme Picker in the bottom panel to view components in one of our alternate themes.`,
    chapters: [
      {
        sections: [
          {
            options: {
              showSource: false,
              allowSourceToggling: false,
              showPropTables: false,
              allowPropTablesToggling: false
            },
            sectionFn: () => (
              <Flex>
                <Column>
                  <Group title="Message">
                    <Element>
                      <Message variant="error">Error message</Message>
                    </Element>
                    <Element>
                      <Message variant="success">Success message</Message>
                    </Element>
                    <Element>
                      <Message variant="warning">Warning message</Message>
                    </Element>
                  </Group>

                  <Group title="Notification">
                    <Element>
                      <Notification variant="error">Error message</Notification>
                    </Element>
                    <Element>
                      <Notification variant="success">Success message</Notification>
                    </Element>
                    <Element>
                      <Notification variant="warning">Warning message</Notification>
                    </Element>
                  </Group>
                </Column>

                <Column>
                  <Group title="Input with Label">
                    <Form>
                      <Label htmlFor="input">Input Label</Label>
                      <Input field="input" />
                    </Form>
                  </Group>

                  <Group title="TextArea with Label">
                    <Form>
                      <Label htmlFor="input">Input Label</Label>
                      <TextArea field="input" />
                    </Form>
                  </Group>

                  <Group title="Lightning Invoice Input">
                    <Form>
                      <LightningInvoiceInput
                        field="input"
                        chain="bitcoin"
                        network="testnet"
                        rows={7}
                        validateOnBlur
                        validateOnChange
                        /* eslint-disable max-len */
                        initialValue="lntb100u1pdaxza7pp5x73t3j7xgvkzgcdvzgpdg74k4pn0uhwuxlxu9qssytjn77x7zs4qdqqcqzysxqyz5vqd20eaq5uferzgzwasu5te3pla7gv8tzk8gcdxlj7lpkygvfdwndhwtl3ezn9ltjejl3hsp36ps3z3e5pp4rzp2hgqjqql80ec3hyzucq4d9axl"
                      />
                    </Form>
                  </Group>
                </Column>

                <Column>
                  <Group title="Button">
                    <Element>
                      <Button>Text</Button>
                    </Element>
                    <Element>
                      <Button size="small">Text</Button>
                    </Element>
                  </Group>

                  <Group title="Secondary Button">
                    <Element>
                      <Button variant="secondary">Text</Button>
                    </Element>
                  </Group>

                  <Group title="Loading Button">
                    <Element>
                      <Button>Send 0.1235 BTC</Button>
                    </Element>
                    <Element>
                      <Button processing disabled>
                        Send 0.1235 BTC
                      </Button>
                    </Element>
                  </Group>
                </Column>

                <Column>
                  <Group title="Dropdown">
                    <Element>
                      <Dropdown
                        activeKey={store.get('fiat')}
                        items={store.get('fiatCurrencies')}
                        onChange={fiat => store.set({ fiat })}
                      />
                    </Element>
                  </Group>

                  <Group title="Toggle">
                    <Form>
                      <Toggle field="input" />
                    </Form>
                  </Group>

                  <Group title="Range">
                    <Form>
                      <Range field="input" />
                    </Form>
                  </Group>
                </Column>
              </Flex>
            )
          }
        ]
      }
    ]
  })
