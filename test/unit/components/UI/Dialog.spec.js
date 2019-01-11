import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { Dialog } from 'components/UI'

describe('component.UI.Header', () => {
  it('should render correctly with two buttons', () => {
    const wrapper = shallow(
      <Dialog
        caption="Title"
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
})
