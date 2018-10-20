import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button as BaseButton, Flex, Text } from 'rebass'
import Spinner from './Spinner'

const Wrapper = styled(BaseButton)`
  transition: all 0.25s;
  outline: none;
  border-radius: 5;
  font-weight: normal;
  line-height: '18px';
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
class Button extends React.PureComponent {
  static displayName = 'Button'
  static defaultProps = {
    processing: false,
    size: 'medium',
    variant: 'normal'
  }
  static propTypes = {
    processing: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    variant: PropTypes.string
  }

  render() {
    const { children, processing, size, ...rest } = this.props
    const sizes = {
      small: {
        x: 3,
        y: 2,
        fontSize: 's'
      },
      medium: {
        x: 3,
        y: 2,
        fontSize: 'm'
      },
      large: {
        x: 5,
        y: 3,
        fontSize: 'l'
      }
    }
    return (
      <Wrapper
        px={sizes[size]['x']}
        py={sizes[size]['y']}
        fontSize={sizes[size]['fontSize']}
        {...rest}
      >
        {processing ? (
          <Flex>
            {processing && <Spinner size="2em" mr="0.5em" />}
            <Text fontFamily="sans">{children}</Text>
          </Flex>
        ) : (
          <Text fontFamily="sans">{children}</Text>
        )}
      </Wrapper>
    )
  }
}

export default Button
