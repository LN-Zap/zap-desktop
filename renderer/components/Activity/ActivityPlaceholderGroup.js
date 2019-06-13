import React from 'react'
import { Box } from 'rebass'
import random from 'lodash/random'
import styled from 'styled-components'
import { height } from 'styled-system'
import { Bar } from 'components/UI'

const StyledBox = styled(Box)(height)

const ActivityPlaceholderGroup = () => {
  return (
    <Box alignItems="center" justifyContent="space-between" py={2}>
      <StyledBox bg="secondaryColor" height={14} mb={1} width={random(50, 60)} />
      <Bar bg="secondaryColor" variant="thin" />
    </Box>
  )
}

export default React.memo(ActivityPlaceholderGroup)
