import React from 'react'
import styled from 'styled-components'
import { Card } from 'rebass'

const SidebarBox = styled(Card)`
  overflow: hidden;
  box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.5);
`

const Sidebar = ({ ...props }) => (
  <SidebarBox
    as="aside"
    bg="primaryColor"
    boxShadow="0 2px 24px 0 rgba(0, 0, 0, 0.5)"
    color="primaryText"
    css={`
      z-index: 1;
    `}
    width={3 / 12}
    {...props}
  />
)

Sidebar.small = props => <Sidebar {...props} width={4 / 16} />
Sidebar.medium = props => <Sidebar {...props} width={5 / 16} />
Sidebar.large = props => <Sidebar {...props} width={6 / 16} />

Sidebar.small.displayName = 'Sidebar Small'
Sidebar.medium.displayName = 'Sidebar Medium'
Sidebar.large.displayName = 'Sidebar Large'

export default Sidebar
