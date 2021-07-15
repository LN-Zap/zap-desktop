import React from 'react'

import { Box } from 'rebass/styled-components'

import Copy from 'components/Icon/FolderOpen'
import { Button } from 'components/UI'

const OpenDialogButton = props => (
  <Button
    height={44}
    ml={-47}
    p={0}
    sx={{ overflow: 'hidden', zIndex: 1, borderRadius: '0 5px 5px 0' }}
    type="button"
    variant="secondary"
    {...props}
  >
    <Box bg="secondaryColor" p={3}>
      <Copy />
    </Box>
  </Button>
)

export default OpenDialogButton
