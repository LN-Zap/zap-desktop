import React from 'react'

import { themeGet } from '@styled-system/theme-get'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import styled, { keyframes } from 'styled-components'

import CloudLightning from 'components/Icon/CloudLightning'
import CloseButton from 'components/UI/CloseButton'
import Heading from 'components/UI/Heading'

import messages from './messages'
import Transition from './Transition'

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

const FullPageGradient = styled(Box)`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    -45deg,
    ${themeGet('colors.primaryAccent')},
    ${themeGet('colors.primaryAccent')},
    ${themeGet('colors.secondaryColor')},
    ${themeGet('colors.primaryColor')}
  );
  background-size: 400% 400%;
  animation: ${gradientMotion} 10s ease infinite;
`

const FullHeightContent = styled(Flex)`
  width: 100%;
  height: 100%;
`

const LoadingBolt = ({ isLoading, message, onClose, hasClose }) => {
  return (
    <Transition isLoading={isLoading}>
      <FullPageGradient color="primaryText">
        <FullHeightContent
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          pt={3}
          px={3}
        >
          <CloudLightning height="140px" width="140px" />
          <Heading.H2 mt={4}>
            <FormattedMessage {...message} />
          </Heading.H2>
        </FullHeightContent>
        {hasClose && (
          <CloseButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }} />
        )}
      </FullPageGradient>
    </Transition>
  )
}

LoadingBolt.propTypes = {
  hasClose: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.object,
  onClose: PropTypes.func,
}

LoadingBolt.defaultProps = {
  message: messages.loading,
}

export default LoadingBolt
