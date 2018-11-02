import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex, Text } from 'rebass'
import BigArrowLeft from 'components/Icon/BigArrowLeft'
import { Button } from 'components/UI'
import messages from './messages'

/**
 * Buttons for Pay.
 */
class PayButtons extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    nextButtonText: PropTypes.node,
    previousStep: PropTypes.func,
    processing: PropTypes.bool,
    showBack: PropTypes.bool,
    showSubmit: PropTypes.bool
  }

  static defaultProps = {
    disabled: false,
    nextButtonText: <FormattedMessage {...messages.next} />,
    previousStep: () => ({}),
    processing: false,
    showBack: true,
    showSubmit: true
  }

  render() {
    const {
      disabled,
      nextButtonText,
      previousStep,
      processing,
      showBack,
      showSubmit,
      ...rest
    } = this.props
    return (
      <Flex {...rest} justifyContent="space-between" alignItems="center">
        <Box width={1 / 5}>
          {showBack && (
            <Button
              type="button"
              variant="secondary"
              onClick={previousStep}
              px={0}
              disabled={processing}
            >
              <Flex>
                <Text>
                  <BigArrowLeft />
                </Text>
                <Text ml={1}>
                  <FormattedMessage {...messages.back} />
                </Text>
              </Flex>
            </Button>
          )}
        </Box>
        {showSubmit && (
          <Button type="submit" mx="auto" disabled={disabled || processing} processing={processing}>
            {nextButtonText}
          </Button>
        )}
        <Box width={1 / 5} />
      </Flex>
    )
  }
}

export default PayButtons
