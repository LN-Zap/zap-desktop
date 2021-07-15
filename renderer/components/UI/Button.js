import React from 'react'

import PropTypes from 'prop-types'
import { Button as BaseButton, Flex, Box } from 'rebass/styled-components'
import styled from 'styled-components'

import Spinner from './Spinner'

const Wrapper = styled(BaseButton)`
  transition: all 0.25s;
  outline: none;
  font-weight: 300;
  line-height: '18px';
  white-space: nowrap;
  text-align: ${({ justify }) => justify};
  &:disabled {
    opacity: 0.5;
  }
  &:hover:enabled {
    cursor: pointer;
  }
`
Wrapper.displayName = 'Button'

/**
 * @name Button
 * @example
 * <Button><Basic button</Button>
 */
const Button = React.forwardRef((props, ref) => {
  const {
    children,
    isActive,
    isDisabled,
    isProcessing,
    size,
    variant,
    className,
    sx,
    icon: Icon,
    ...rest
  } = props
  const sizes = {
    small: {
      x: 3,
      y: 2,
    },
    medium: {
      x: 5,
      y: 3,
    },
    large: {
      x: 5,
      y: 3,
    },
  }
  const dimensions = sizes[size] || sizes.medium
  if (variant === 'secondary') {
    dimensions.x = 0
  }

  const fontWeight = variant === 'menu' && !isActive ? 'light ' : 'normal'
  const fontSize = size === 'large' ? 'l' : 'm'
  const borderRadius = variant === 'secondary' ? 0 : 5

  // support custom styled and styled-components
  const wrapperClasses = [className, isActive ? 'active' : null]
    .filter(cls => Boolean(cls))
    .join(' ')
  return (
    <Wrapper
      className={wrapperClasses}
      disabled={isDisabled}
      px={dimensions.x}
      py={dimensions.y}
      ref={ref}
      {...rest}
      sx={{
        borderRadius,
        ...sx,
      }}
      variant={variant}
    >
      {isProcessing || Icon ? (
        <Flex alignItems="center" justifyContent="center">
          {isProcessing ? <Spinner height="0.8em" width="0.8em" /> : Icon && <Icon />}
          <Box fontSize={fontSize} fontWeight={fontWeight} ml={2}>
            {children}
          </Box>
        </Flex>
      ) : (
        <Box fontSize={fontSize} fontWeight={fontWeight}>
          {children}
        </Box>
      )}
    </Wrapper>
  )
})

Button.displayName = 'Button'

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.func,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isProcessing: PropTypes.bool,
  justify: PropTypes.oneOf(['left', 'right', 'center']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  sx: PropTypes.object,
  variant: PropTypes.string,
}

Button.defaultProps = {
  size: 'medium',
  justify: 'center',
  variant: 'normal',
}

export default Button
