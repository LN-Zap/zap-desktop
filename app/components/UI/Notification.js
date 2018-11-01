import React from 'react'
import PropTypes from 'prop-types'
import { Card, Flex, Text } from 'rebass'
import X from 'components/Icon/X'
import SystemSuccess from 'components/Icon/SystemSuccess'
import SystemWarning from 'components/Icon/SystemWarning'
import SystemError from 'components/Icon/SystemError'
import Spinner from './Spinner'

/**
 * @render react
 * @name Notification
 * @example
 * <Notification variant="success">Success message</Success/>
 */
class Notification extends React.Component {
  static displayName = 'Notification'

  static defaultProps = {
    processing: false,
    variant: 'success'
  }

  static propTypes = {
    children: PropTypes.node,
    processing: PropTypes.bool,
    variant: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = { hover: false }
    this.hoverOn = this.hoverOn.bind(this)
    this.hoverOff = this.hoverOff.bind(this)
  }

  hoverOn() {
    this.setState({ hover: true })
  }

  hoverOff() {
    this.setState({ hover: false })
  }

  render() {
    const { children, processing, variant } = this.props
    const { hover } = this.state
    return (
      <Card
        px={3}
        py={3}
        borderRadius="5px"
        boxShadow="0 3px 4px 0 rgba(30, 30, 30, 0.5)"
        css={{ cursor: 'pointer' }}
        {...this.props}
        onMouseEnter={this.hoverOn}
        onMouseLeave={this.hoverOff}
      >
        <Flex justifyContent="space-between">
          <Flex>
            {processing && <Spinner size="2em" mr="0.5em" />}
            {!processing && variant === 'success' && <SystemSuccess />}
            {!processing && variant === 'warning' && <SystemWarning />}
            {!processing && variant === 'error' && <SystemError />}
            <Text ml={2}>{children}</Text>
          </Flex>
          <X strokeWidth={hover ? 2 : null} />
        </Flex>
      </Card>
    )
  }
}

export default Notification
