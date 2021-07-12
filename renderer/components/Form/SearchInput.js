import React from 'react'

import { themeGet } from '@styled-system/theme-get'
import styled from 'styled-components'

import Search from 'components/Icon/Search'

import Input from './Input'

const Icon = styled(Search)`
  cursor: pointer;
  height: 16px;
  width: 16px;
  position: absolute;
  left: 16px;
  user-select: none;
  color: ${themeGet('colors.gray')};
`

const SearchInput = props => {
  return <Input type="search" {...props} prefix={<Icon />} />
}

export default SearchInput
