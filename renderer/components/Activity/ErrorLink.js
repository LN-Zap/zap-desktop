import React from 'react'

import styled from 'styled-components'

import { Message } from 'components/UI'

const ErrorLinkContainer = styled(Message)`
  &:hover {
    cursor: pointer;
  }
`

const ErrorLink = props => <ErrorLinkContainer variant="error" {...props} />

export default ErrorLink
