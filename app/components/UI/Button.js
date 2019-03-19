import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button as BaseButton, Flex, Text } from 'rebass'
import Spinner from './Spinner'

const Wrapper = styled(BaseButton)`
  transition: all 0.25s;
  outline: none;
  font-weight: 300;
  line-height: '18px';
  white-space: nowrap;
  &:disabled {
    opacity: 0.5;
  }
  &:hover:enabled {
    cursor: pointer;
  }
`
Wrapper.displayName = 'Button'

/**
 * @render react
 * @name Button
 * @example
 * <Button><Basic button</Button>
 */
const Button = React.forwardRef((props, ref) => {
  let { children, isActive, isDisabled, isProcessing, size, variant, className, ...rest } = props
  const sizes = {
    small: {
      x: 3,
      y: 2,
    },
    medium: {
      x: 5,
      y: 3,
    },
  }

  size = sizes[size] || sizes['medium']
  if (variant === 'secondary') {
    size.x = 0
  }

  const borderRadius = variant === 'secondary' ? 0 : 5

  //support custom styled and styled-components
  const wrapperClasses = [className, isActive ? 'active' : null]
    .filter(cls => Boolean(cls))
    .join(' ')

  return (
    <Wrapper
      ref={ref}
      borderRadius={borderRadius}
      className={wrapperClasses}
      disabled={isDisabled}
      px={size['x']}
      py={size['y']}
      variant={variant}
      {...rest}
    >
      {isProcessing ? (
        <Flex alignItems="center">
          {isProcessing && <Spinner />}
          <Text fontFamily="sans" fontWeight="normal" ml={2}>
            {children}
          </Text>
        </Flex>
      ) : (
        <Text fontFamily="sans" fontWeight="normal">
          {children}
        </Text>
      )}
    </Wrapper>
  )
})

Button.displayName = 'Button'

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isProcessing: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  variant: PropTypes.string,
}

Button.defaultProps = {
  isProcessing: false,
  isActive: false,
  isDisabled: false,
  size: 'medium',
  variant: 'normal',
}

export default Button
