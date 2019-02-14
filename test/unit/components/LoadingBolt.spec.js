import React from 'react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { ThemeProvider } from 'styled-components'
import LoadingBolt from 'components/LoadingBolt'
import CloudLightning from 'components/Icon/CloudLightning'
import { dark } from 'themes'
import { mountWithIntl } from '../__helpers__/intl-enzyme-test-helper'

configure({ adapter: new Adapter() })

describe('component.LoadingBolt', () => {
  const el = mountWithIntl(
    <ThemeProvider theme={dark}>
      <LoadingBolt isLoading />
    </ThemeProvider>
  )
  it('should show defaults', () => {
    expect(el.find(CloudLightning)).toHaveLength(1)
    expect(el.text()).toContain('Loading')
  })
})
