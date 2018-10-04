import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button as BaseButton } from 'rebass'
import Spinner from './Spinner'

const Wrapper = styled(BaseButton)`
  line-height: 18px;
  transition: all 0.25s;
  outline: none;
  &:focus {
    box-shadow: 0 0 3px ${props => props.theme.lightningOrange};
  }
  &:disabled {
    opacity: 0.5;
  }
  &:hover:enabled {
    cursor: pointer;
  }
`

/**
 * @render react
 * @name Button
 * @example
 * <Button><Basic button</Button>
 */
const Button = props => {
  const { children, processing, size } = props
  const sizes = {
    small: {
      x: 3,
      y: 2
    },
    large: {
      x: 5,
      y: 3
    }
  }
  let content = children
  if (processing) {
    content = (
      <span>
        <Spinner size="2em" mr="0.5em" /> {props.children}
      </span>
    )
  }
  return (
    <Wrapper {...props} px={sizes[size]['x']} py={sizes[size]['y']}>
      {content}
    </Wrapper>
  )
}

Button.displayName = 'Button'
Button.defaultProps = {
  /* eslint-disable react/default-props-match-prop-types */
  fontWeight: 'normal',
  variant: 'normal',
  processing: false,
  borderRadius: 5,
  size: 'small'
}
Button.propTypes = {
  children: PropTypes.node.isRequired,
  processing: PropTypes.bool,
  size: PropTypes.string
}

export default Button
