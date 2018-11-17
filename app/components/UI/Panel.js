import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'

const PanelHeader = ({ children, ...rest }) => (
  <Box {...rest} as="header">
    {children}
  </Box>
)
PanelHeader.propTypes = { children: PropTypes.node }

const PanelBody = ({ children, css, ...rest }) => (
  <Box
    {...rest}
    as="section"
    css={Object.assign(
      {
        flex: 1
      },
      css
    )}
  >
    {children}
  </Box>
)
PanelBody.propTypes = { children: PropTypes.node }

const PanelFooter = ({ children, ...rest }) => (
  <Box {...rest} as="footer" pt="auto">
    {children}
  </Box>
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
