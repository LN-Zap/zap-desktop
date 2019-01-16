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
        header="Title"
        onClose={() => {}}
        buttons={[{ name: 'Delete', onClick: () => {} }, { name: 'Cancel', onClick: () => {} }]}
      />
    )
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('should render correctly with one button', () => {
    const wrapper = shallow(
      <Dialog caption="Title" onClose={() => {}} buttons={[{ name: 'Ok', onClick: () => {} }]} />
    )
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('should render correctly with custom content', () => {
    const CustomDialog = () => {
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
        <Dialog header={customHeader} onClose={() => alert('closed')} buttons={customButtons}>
          <Flex flexDirection="column" alignItems="center">
            <Text fontSize="xl">This is a custom body</Text>
          </Flex>
        </Dialog>
      )
    }

    const wrapper = shallow(<CustomDialog />)

    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
