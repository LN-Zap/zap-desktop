import React from 'react'
import PropTypes from 'prop-types'
import { Card, Flex, Text } from 'rebass'
import X from 'components/Icon/X'
import Success from 'components/Icon/Success'
import Warning from 'components/Icon/Warning'
import Error from 'components/Icon/Error'
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

  state = { hover: false }

  hoverOn = () => {
    this.setState({ hover: true })
  }

  hoverOff = () => {
    this.setState({ hover: false })
  }

  render() {
    const { children, processing, variant, ...rest } = this.props
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
        {...rest}
      >
        <Flex justifyContent="space-between">
          <Flex alignItems="center">
            <Text fontSize={17}>
              {processing && <Spinner size="2em" mr="0.5em" />}
              {!processing && variant === 'success' && <Success />}
              {!processing && variant === 'warning' && <Warning />}
              {!processing && variant === 'error' && <Error />}
            </Text>
            <Text fontWeight="normal" ml={2}>
              {children}
            </Text>
          </Flex>
          <Text fontSize="xs" mt={1}>
            <X strokeWidth={hover ? 5 : 4} />
          </Text>
        </Flex>
      </Card>
    )
  }
}

export default Notification
