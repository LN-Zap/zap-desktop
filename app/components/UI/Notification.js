import React from 'react'
import PropTypes from 'prop-types'
import { Card, Flex, Text } from 'rebass'
import MdClose from 'react-icons/lib/md/close'
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

  render() {
    const { children, processing, variant } = this.props
    return (
      <Card px={3} py={3} borderRadius="5px" {...this.props}>
        <Flex justifyContent="space-between">
          <Flex>
            {processing && <Spinner size="2em" mr="0.5em" />}
            {!processing && variant === 'success' && <SystemSuccess />}
            {!processing && variant === 'warning' && <SystemWarning />}
            {!processing && variant === 'error' && <SystemError />}
            <Text ml={2}>{children}</Text>
          </Flex>
          <MdClose />
        </Flex>
      </Card>
    )
  }
}

export default Notification
