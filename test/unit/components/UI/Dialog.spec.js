import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { Flex } from 'rebass'
import { Dialog, Text, Heading, Button } from 'components/UI'
import Globe from 'components/Icon/Globe'

describe('component.UI.Dialog', () => {
  it('should render correctly with two buttons', () => {
    const wrapper = shallow(
      <Dialog
        buttons={[{ name: 'Delete', onClick: () => {} }, { name: 'Cancel', onClick: () => {} }]}
        header="Title"
        onClose={() => {}}
      />
    )
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('should render correctly with one button', () => {
    const wrapper = shallow(
      <Dialog buttons={[{ name: 'Ok', onClick: () => {} }]} header="Title" onClose={() => {}} />
    )
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('should render correctly with custom content', () => {
    const CustomDialog = () => {
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
        <Dialog buttons={customButtons} header={customHeader} onClose={() => alert('closed')}>
          <Flex alignItems="center" flexDirection="column">
            <Text fontSize="xl">This is a custom body</Text>
          </Flex>
        </Dialog>
      )
    }

    const wrapper = shallow(<CustomDialog />)

    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
