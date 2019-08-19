import React, { useState } from 'react'
import styled from 'styled-components'
import { themeGet } from '@styled-system/theme-get'
import Input from './Input'
import Eye from 'components/Icon/Eye'
import EyeOff from 'components/Icon/EyeOff'

const iconCss = `
  cursor: pointer;
  height: 32px;
  padding: 0 8px;
  position: absolute;
  right: 8px;
  user-select: none;
  width: 32px;
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

  return (
    <Input css="position: relative;" type={isPasswordVisible ? 'text' : 'password'} {...props}>
      {isPasswordVisible ? (
        <StyledEyeOffIcon onClick={toggleIsPasswordVisible} />
      ) : (
        <StyledEyeIcon onClick={toggleIsPasswordVisible} />
      )}
    </Input>
  )
}

export default PasswordInput
