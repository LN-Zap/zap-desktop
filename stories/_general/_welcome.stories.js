import React from 'react'

import { storiesOf } from '@storybook/react'
import { Flex } from 'rebass/styled-components'

import { Form, Input, LightningInvoiceInput, Range, TextArea, Toggle } from 'components/Form'
import { Button, Dropdown, Message, Notification } from 'components/UI'

import { Column, Group, Element } from '../helpers'
import { Provider } from '../Provider'

storiesOf('General', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('Zap Style Guide', {
    subtitle: 'Reusable components for Zap.',
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
              allowPropTablesToggling: false,
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
                      <Input field="input" label="Input Label" />
                    </Form>
                  </Group>

                  <Group title="Input with Label and Tooltip">
                    <Form>
                      <Input
                        field="input"
                        label="Input Label"
                        tooltip="Input label tooltip content"
                      />
                    </Form>
                  </Group>

                  <Group title="TextArea with Label">
                    <Form>
                      <TextArea field="input" label="Input Label" />
                    </Form>
                  </Group>

                  <Group title="Lightning Invoice Input">
                    <Form>
                      <LightningInvoiceInput
                        chain="bitcoin"
                        field="input"
                        /* eslint-disable max-len */
                        initialValue="lntb100u1pdaxza7pp5x73t3j7xgvkzgcdvzgpdg74k4pn0uhwuxlxu9qssytjn77x7zs4qdqqcqzysxqyz5vqd20eaq5uferzgzwasu5te3pla7gv8tzk8gcdxlj7lpkygvfdwndhwtl3ezn9ltjejl3hsp36ps3z3e5pp4rzp2hgqjqql80ec3hyzucq4d9axl"
                        network="testnet"
                        rows={7}
                        validateOnBlur
                        validateOnChange
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
                      <Button isDisabled isProcessing>
                        Send 0.1235 BTC
                      </Button>
                    </Element>
                  </Group>
                </Column>

                <Column>
                  <Group title="Dropdown">
                    <Element>
                      <Dropdown
                        activeKey="key1"
                        items={[
                          { key: 'key1', value: 'Key 1' },
                          { key: 'key2', value: 'Key 2' },
                        ]}
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
            ),
          },
        ],
      },
    ],
  })
