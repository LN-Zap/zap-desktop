import React from 'react'

import { mount } from 'enzyme'
import { RawIntlProvider } from 'react-intl'
import { ThemeProvider } from 'styled-components'

import CloudLightning from 'components/Icon/CloudLightning'
import LoadingBolt from 'components/Loading/LoadingBolt'
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
