import React from 'react'
import { Flex } from 'rebass'
import { storiesOf } from '@storybook/react'
import { Dialog, Text, Heading, Countdown, Button, Page } from 'components/UI'
import Globe from 'components/Icon/Globe'

storiesOf('Components', module)
  .addDecorator(story => (
    <Page css={{ backgroundColor: '#313340' }} pl={4}>
      {story()}
    </Page>
  ))
  .addWithChapters('Dialog', {
    subtitle: 'For showing prompts and messages',
    chapters: [
      {
        sections: [
          {
            title: 'Two buttons',
            sectionFn: () => (
              <Dialog
                buttons={[
                  { name: 'Delete', onClick: () => alert('Delete') },
                  { name: 'Cancel', onClick: () => alert('Cancel') },
                ]}
                header={`Are you sure you want to delete "MyWallet" ?`}
                onClose={() => alert('closed')}
              />
            ),
          },
          {
            title: 'Message box mode',
            sectionFn: () => (
              <Dialog
                buttons={[{ name: 'Ok', onClick: () => alert('Ok') }]}
                header="Your wallet has been removed"
                onClose={() => alert('closed')}
              />
            ),
          },
          {
            title: 'Custom dialog',
            sectionFn: () => {
              const date = new Date(new Date().getTime() + 60000)
              const customHeader = (
                <Flex alignItems="center" alignSelf="stretch" flexDirection="column" mb={3}>
                  <Globe color="white" height={64} width={64} />
                  <Heading.h2>Custom heading</Heading.h2>
                </Flex>
              )

              const customButtons = (
                <>
                  <Button key="0" variant="primary">
                    Primary
                  </Button>
                  <Button key="1" variant="secondary">
                    Secondary
                  </Button>
                </>
              )

              return (
                <Dialog
                  buttons={customButtons}
                  header={customHeader}
                  onClose={() => alert('closed')}
                >
                  <Flex alignItems="center" flexDirection="column">
                    <Text fontSize="xl">This is a custom body</Text>
                    <Countdown date={date} />
                  </Flex>
                </Dialog>
              )
            },
          },
        ],
      },
    ],
  })
