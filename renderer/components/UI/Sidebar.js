import React from 'react'
import styled from 'styled-components'
import { themeGet } from '@styled-system/theme-get'
import { Flex } from 'rebass/styled-components'

const SidebarBox = styled(Flex)`
  overflow: hidden;
  box-shadow: ${themeGet('shadows.m')};
  z-index: 1;
`

const Sidebar = ({ ...props }) => (
  <SidebarBox
    as="aside"
    bg="primaryColor"
    color="primaryText"
    flexDirection="column"
    width={4 / 12}
    {...props}
  />
)

Sidebar.small = props => <Sidebar {...props} width={3 / 16} />
Sidebar.medium = props => <Sidebar {...props} width={4 / 16} />
Sidebar.large = props => <Sidebar {...props} width={6 / 16} />

Sidebar.small.displayName = 'Sidebar Small'
Sidebar.medium.displayName = 'Sidebar Medium'
Sidebar.large.displayName = 'Sidebar Large'

export default Sidebar
