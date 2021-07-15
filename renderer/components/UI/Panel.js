import React from 'react'

import { Box, Flex } from 'rebass/styled-components'

const PanelHeader = props => <Box as="header" {...props} />

const PanelBody = props => <Box as="section" {...props} flex={1} />

const PanelFooter = props => <Box as="footer" {...props} pt="auto" />

const Panel = props => <Flex as="article" height="100%" {...props} flexDirection="column" />

Panel.Header = PanelHeader
Panel.Body = PanelBody
Panel.Footer = PanelFooter

export default Panel
export { PanelHeader, PanelBody, PanelFooter }
