import React from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import styled, { keyframes, withTheme } from 'styled-components'
import CloudLightning from 'components/Icon/CloudLightning'
import { Heading } from 'components/UI'
import messages from './messages'

const gradientMotion = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const Container = styled(animated.div)`
  z-index: 1000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const FullPageGradient = styled(Flex)`
  position: absolute;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: linear-gradient(
    -45deg,
    ${props => props.theme.colors.lightningOrange},
    ${props => props.theme.colors.lightningOrange},
    ${props => props.theme.colors.secondaryColor},
    ${props => props.theme.colors.primaryColor}
  );
  background-size: 400% 400%;
  animation: ${gradientMotion} 10s ease infinite;
  pointer-events: none;
`

class LoadingBolt extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    message: PropTypes.object,
  }

  static defaultProps = {
    message: messages.loading,
  }

  render() {
    const { isLoading, message } = this.props

    return (
      <Transition
        enter={{ opacity: 1, pointerEvents: 'auto' }}
        from={{ opacity: 1, pointerEvents: 'auto' }}
        items={isLoading}
        leave={{ opacity: 0, pointerEvents: 'none' }}
        native
      >
        {show =>
          show &&
          (springStyles => (
            <Container style={springStyles}>
              <FullPageGradient alignItems="center" color="primaryText" justifyContent="center">
                <Flex alignItems="center" flexDirection="column">
                  <CloudLightning height="140px" width="140px" />
                  <Heading.h2 mt={4}>
                    <FormattedMessage {...message} />
                  </Heading.h2>
                </Flex>
              </FullPageGradient>
            </Container>
          ))
        }
      </Transition>
    )
  }
}

export default withTheme(LoadingBolt)
