import React from 'react'
import { ThemeProvider } from 'styled-components'
import { RawIntlProvider } from 'react-intl'
import { mount } from 'enzyme'
import LoadingBolt from 'components/LoadingBolt'
import CloudLightning from 'components/Icon/CloudLightning'
import { dark } from 'themes'
import intl from '../__helpers__/intl'

describe('component.LoadingBolt', () => {
  const el = mount(
    <RawIntlProvider value={intl}>
      <ThemeProvider theme={dark}>
        <LoadingBolt isLoading />
      </ThemeProvider>
    </RawIntlProvider>
  )
  it('should show defaults', () => {
    expect(el.find(CloudLightning)).toHaveLength(1)
    expect(el.text()).toContain('Loading')
  })
})
