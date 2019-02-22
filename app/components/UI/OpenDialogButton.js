import React from 'react'
import { Box } from 'rebass'
import { Button } from 'components/UI'
import Copy from 'components/Icon/FolderOpen'
import styled from 'styled-components'

const CustomButton = styled(Button)`
  margin-left: -46px;
  height: 46px;
  margin-top: 0px;
  padding: 0;
  border-radius: 0 5px 5px 0;
  overflow: hidden;
`

const OpenDialogButton = props => (
  <CustomButton type="button" variant="secondary" {...props}>
    <Box bg="secondaryColor" p={3}>
      <Copy />
    </Box>
  </CustomButton>
)

export default OpenDialogButton
