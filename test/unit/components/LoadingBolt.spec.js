import React from 'react'
import { ThemeProvider } from 'styled-components'
import LoadingBolt from 'components/LoadingBolt'
import CloudLightning from 'components/Icon/CloudLightning'
import { dark } from 'themes'
import { mountWithIntl } from '../__helpers__/intl-enzyme-test-helper'

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
