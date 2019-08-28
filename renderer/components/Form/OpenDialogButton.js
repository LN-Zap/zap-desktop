import React from 'react'
import { Box } from 'rebass/styled-components'
import styled from 'styled-components'
import Copy from 'components/Icon/FolderOpen'
import { Button } from 'components/UI'

const CustomButton = styled(Button)`
  margin-left: -46px;
  height: 45px;
  margin-top: 1px;
  padding: 0;
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  z-index: 1;
`

const OpenDialogButton = props => (
  <CustomButton type="button" variant="secondary" {...props}>
    <Box bg="secondaryColor" p={3}>
      <Copy />
    </Box>
  </CustomButton>
)

export default OpenDialogButton
