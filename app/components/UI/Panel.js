import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { Text } from 'components/UI'

const PanelHeader = ({ children, ...rest }) => (
  <Text pb={3} textAlign="center" {...rest} as="header">
    {children}
  </Text>
)
PanelHeader.propTypes = { children: PropTypes.node }

const PanelBody = ({ children, ...rest }) => (
  <Box py={3} {...rest} as="section" css={{ flex: 1 }}>
    {children}
  </Box>
)
PanelBody.propTypes = { children: PropTypes.node }

const PanelFooter = ({ children, ...rest }) => (
  <Text textAlign="center" {...rest} as="footer" pt="auto">
    {children}
  </Text>
)
PanelFooter.propTypes = { children: PropTypes.node }

class Panel extends React.Component {
  static Header = PanelHeader
  static Body = PanelBody
  static Footer = PanelFooter

  render() {
    const { children, ...rest } = this.props
    return (
      <Flex {...rest} as="article" flexDirection="column" css={{ height: '100%' }} {...rest}>
        {children}
      </Flex>
    )
  }
}

export default Panel
export { PanelHeader, PanelBody, PanelFooter }
