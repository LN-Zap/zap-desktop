import React from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring/renderprops.cjs'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import styled, { keyframes, withTheme } from 'styled-components'
import CloseButton from 'components/UI/CloseButton'
import Heading from 'components/UI/Heading'
import CloudLightning from 'components/Icon/CloudLightning'
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

const AnimationContainer = styled(animated.div)`
  z-index: 1000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const FullHeightContainer = styled(Box)`
  z-index: 1000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const FullPageGradient = styled(Box)`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    -45deg,
    ${props => props.theme.colors.primaryAccent},
    ${props => props.theme.colors.primaryAccent},
    ${props => props.theme.colors.secondaryColor},
    ${props => props.theme.colors.primaryColor}
  );
  background-size: 400% 400%;
  animation: ${gradientMotion} 10s ease infinite;
`

const FullHeightContent = styled(Flex)`
  width: 100%;
  height: 100%;
`

class LoadingBolt extends React.PureComponent {
  static propTypes = {
    hasClose: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
    message: PropTypes.object,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    message: messages.loading,
  }

  render() {
    const { isLoading, message, onClose, hasClose } = this.props

    return (
      <Transition
        enter={{ opacity: 1 }}
        from={{ opacity: 1 }}
        items={isLoading}
        leave={{ opacity: 0 }}
        native
      >
        {show =>
          show &&
          (springStyles => (
            <AnimationContainer style={springStyles}>
              <FullPageGradient color="primaryText">
                <FullHeightContent
                  alignItems="center"
                  flexDirection="column"
                  justifyContent="center"
                  pt={3}
                  px={3}
                >
                  <CloudLightning height="140px" width="140px" />
                  <Heading.h2 mt={4}>
                    <FormattedMessage {...message} />
                  </Heading.h2>
                </FullHeightContent>
                {hasClose && (
                  <FullHeightContainer pt={3} px={3}>
                    <CloseButton onClick={onClose} />
                  </FullHeightContainer>
                )}
              </FullPageGradient>
            </AnimationContainer>
          ))
        }
      </Transition>
    )
  }
}

export default withTheme(LoadingBolt)
