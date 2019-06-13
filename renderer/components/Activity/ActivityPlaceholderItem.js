import React from 'react'
import { Box, Flex } from 'rebass'
import random from 'lodash/random'
import styled from 'styled-components'
import { height } from 'styled-system'

const StyledBox = styled(Box)(height)

const ActivityPlaceholderItem = () => {
  return (
    <Flex alignItems="center" justifyContent="space-between" py={2}>
      <Flex alignItems="flex-start" flexDirection="column" width={3 / 4}>
        <StyledBox bg="secondaryColor" height={14} mb={1} width={random(60, 200)} />
        <StyledBox bg="secondaryColor" height="8px" mb={1} width={random(40, 60)} />
      </Flex>

      <Flex alignItems="flex-end" flexDirection="column" width={1 / 4}>
        <StyledBox bg="secondaryColor" height="14px" mb={1} width={random(50, 80)} />
        <StyledBox bg="secondaryColor" height="8px" width={random(30, 40)} />
      </Flex>
    </Flex>
  )
}

export default React.memo(ActivityPlaceholderItem)
