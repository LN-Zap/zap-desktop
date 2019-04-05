import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import { themeGet } from 'styled-system'
import { Bar, Span, Text } from 'components/UI'
import AngleRight from 'components/Icon/AngleRight'

const MenuButton = styled(Flex)`
  cursor: pointer;
  &:hover {
    background-color: ${themeGet('colors.tertiaryColor')};
  }
`
const ChannelsMenuItem = ({ title, onClick, description, ...rest }) => (
  <Box {...rest}>
    <Bar variant="light" />
    <MenuButton alignItems="center" justifyContent="space-between" onClick={onClick} px={3}>
      <Box py={2}>
        <Text>{title}</Text>
        <Text color="gray">{description}</Text>
      </Box>
      <Span color="gray">
        <AngleRight height="8px" />
      </Span>
    </MenuButton>
  </Box>
)

ChannelsMenuItem.propTypes = {
  description: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
}

export default ChannelsMenuItem
