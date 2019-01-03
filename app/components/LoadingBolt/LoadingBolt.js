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
    isLoading: PropTypes.bool.isRequired
  }

  render() {
    const { isLoading } = this.props

    return (
      <Transition
        native
        items={isLoading}
        from={{ opacity: 1 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {show =>
          show &&
          (springStyles => (
            <animated.div style={springStyles}>
              <FullPageGradient justifyContent="center" alignItems="center" color="primaryText">
                <Flex alignItems="center" flexDirection="column">
                  <CloudLightning height="140px" width="140px" />
                  <Heading.h2 mt={4}>
                    <FormattedMessage {...messages.loading} />
                  </Heading.h2>
                </Flex>
              </FullPageGradient>
            </animated.div>
          ))
        }
      </Transition>
    )
  }
}

export default withTheme(LoadingBolt)
