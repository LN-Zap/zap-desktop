import React from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring/renderprops.cjs'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass'
import styled, { keyframes, withTheme } from 'styled-components'
import CloudLightning from 'components/Icon/CloudLightning'
import Heading from 'components/UI/Heading'
import X from 'components/Icon/X'
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
    ${props => props.theme.colors.lightningOrange},
    ${props => props.theme.colors.lightningOrange},
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

const LoadingCloseButtonWrapper = styled(Box)`
  height: 40px;
  cursor: pointer;
  opacity: 0.6;
  &:hover: {
    opacity: 1;
  }
`

const LoadingCloseButton = ({ onClose }) => (
  <Flex justifyContent="flex-end">
    <LoadingCloseButtonWrapper onClick={onClose} p={2}>
      <X height={20} width={20} />
    </LoadingCloseButtonWrapper>
  </Flex>
)

LoadingCloseButton.propTypes = {
  onClose: PropTypes.func,
}

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
                >
                  <CloudLightning height="140px" width="140px" />
                  <Heading.h2 mt={4}>
                    <FormattedMessage {...message} />
                  </Heading.h2>
                </FullHeightContent>
                {hasClose && (
                  <FullHeightContainer>
                    <LoadingCloseButton onClose={onClose} />
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
