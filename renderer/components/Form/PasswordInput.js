import React, { useState } from 'react'

import { themeGet } from '@styled-system/theme-get'
import styled from 'styled-components'

import Eye from 'components/Icon/Eye'
import EyeOff from 'components/Icon/EyeOff'

import Input from './Input'

const iconCss = `
  cursor: pointer;
  height: 16px;
  width: 16px;
  padding: 0;
  position: absolute;
  right: 16px;
  user-select: none;
`
const StyledEyeIcon = styled(Eye)`
  ${iconCss}
  color: ${themeGet('colors.gray')};
`
const StyledEyeOffIcon = styled(EyeOff)`
  ${iconCss}
  color: ${themeGet('colors.gray')};
`

const PasswordInput = props => {
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const toggleIsPasswordVisible = () => {
    setPasswordVisible(!isPasswordVisible)
  }

  const suffix = isPasswordVisible ? (
    <StyledEyeOffIcon onClick={toggleIsPasswordVisible} />
  ) : (
    <StyledEyeIcon onClick={toggleIsPasswordVisible} />
  )

  return <Input suffix={suffix} type={isPasswordVisible ? 'text' : 'password'} {...props} />
}

export default PasswordInput
