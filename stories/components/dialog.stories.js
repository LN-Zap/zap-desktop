import React from 'react'
import { Flex } from 'rebass'
import { storiesOf } from '@storybook/react'
import { Dialog, Text, Heading, Countdown, Button, Page } from 'components/UI'
import Globe from 'components/Icon/Globe'

storiesOf('Components', module)
  .addDecorator(story => (
    <Page pl={4} css={{ backgroundColor: '#313340' }}>
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
                header={`Are you sure you want to delete "MyWallet" ?`}
                onClose={() => alert('closed')}
                buttons={[
                  { name: 'Delete', onClick: () => alert('Delete') },
                  { name: 'Cancel', onClick: () => alert('Cancel') }
                ]}
              />
            )
          },
          {
            title: 'Message box mode',
            sectionFn: () => (
              <Dialog
                header="Your wallet has been removed"
                onClose={() => alert('closed')}
                buttons={[{ name: 'Ok', onClick: () => alert('Ok') }]}
              />
            )
          },
          {
            title: 'Custom dialog',
            sectionFn: () => {
              const date = new Date(new Date().getTime() + 60000)
              const customHeader = (
                <Flex flexDirection="column" alignItems="center" mb={3} alignSelf="stretch">
                  <Globe width={64} height={64} color="white" />
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
                  header={customHeader}
                  onClose={() => alert('closed')}
                  buttons={customButtons}
                >
                  <Flex flexDirection="column" alignItems="center">
                    <Text fontSize="xl">This is a custom body</Text>
                    <Countdown date={date} />
                  </Flex>
                </Dialog>
              )
            }
          }
        ]
      }
    ]
  })
