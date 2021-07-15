import React from 'react'

import { Flex } from 'rebass/styled-components'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import Eye from 'components/Icon/Eye'
import { Dialog, Text, Heading, Button } from 'components/UI'

describe('component.UI.Dialog', () => {
  it('should render correctly with two buttons', () => {
    const tree = renderWithTheme(
      <Dialog
        buttons={[
          { name: 'Delete', onClick: () => {} },
          { name: 'Cancel', onClick: () => {} },
        ]}
        header="Title"
        onClose={() => {}}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly with one button', () => {
    const tree = renderWithTheme(
      <Dialog buttons={[{ name: 'Ok', onClick: () => {} }]} header="Title" onClose={() => {}} />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly with custom content', () => {
    const CustomDialog = () => {
      const customHeader = (
        <Flex alignItems="center" alignSelf="stretch" flexDirection="column" mb={3}>
          <Eye color="white" height={64} width={64} />
          <Heading.H2>Custom heading</Heading.H2>
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
        <Dialog buttons={customButtons} header={customHeader} onClose={() => alert('closed')}>
          <Flex alignItems="center" flexDirection="column">
            <Text fontSize="xl">This is a custom body</Text>
          </Flex>
        </Dialog>
      )
    }

    const tree = renderWithTheme(<CustomDialog />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
