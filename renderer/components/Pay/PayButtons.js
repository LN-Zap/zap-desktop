import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex, Text } from 'rebass/styled-components'

import ArrowLeft from 'components/Icon/ArrowLeft'
import { Button } from 'components/UI'

import messages from './messages'

/**
 * Buttons for Pay.
 */
class PayButtons extends React.PureComponent {
  static propTypes = {
    hasBackButton: PropTypes.bool,
    hasSubmitButton: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isProcessing: PropTypes.bool,
    nextButtonText: PropTypes.node,
    previousStep: PropTypes.func,
  }

  static defaultProps = {
    nextButtonText: <FormattedMessage {...messages.next} />,
    previousStep: () => ({}),
    hasBackButton: true,
    hasSubmitButton: true,
  }

  render() {
    const {
      isDisabled,
      nextButtonText,
      previousStep,
      isProcessing,
      hasBackButton,
      hasSubmitButton,
      ...rest
    } = this.props
    return (
      <Flex {...rest} alignItems="center" justifyContent="space-between">
        <Box width={1 / 5}>
          {hasBackButton && (
            <Button
              isDisabled={isProcessing}
              onClick={previousStep}
              px={0}
              type="button"
              variant="secondary"
            >
              <Flex>
                <Text>
                  <ArrowLeft />
                </Text>
                <Text ml={1}>
                  <FormattedMessage {...messages.back} />
                </Text>
              </Flex>
            </Button>
          )}
        </Box>
        {hasSubmitButton && (
          <Button
            isDisabled={isDisabled || isProcessing}
            isProcessing={isProcessing}
            mx="auto"
            type="submit"
          >
            {nextButtonText}
          </Button>
        )}
        <Box width={1 / 5} />
      </Flex>
    )
  }
}

export default PayButtons
