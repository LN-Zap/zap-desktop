import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import range from 'lodash/range'
import { Flex, Box } from 'rebass/styled-components'
import { animated, Transition } from 'react-spring/renderprops.cjs'
import { themeGet } from '@styled-system/theme-get'
import { Card, Bar } from 'components/UI'
import { useWindowDimensions } from 'hooks'
import WalletLogo from 'components/Wallet/WalletLogo'

const pulse = props => keyframes`
0% {
  background-color: ${themeGet('colors.secondaryColor')(props)};
}
50% {
  background-color: ${themeGet('colors.tertiaryColor')(props)};
}
100% {
  background-color: ${themeGet('colors.secondaryColor')(props)};
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

const PlaceholderBox = props => <Box sx={{ borderRadius: 'xl' }} {...props} />

const Placeholder = styled(PlaceholderBox)`
  animation: ${pulse} 2s linear infinite;
`

const ActivityGroupRow = () => {
  const [rnd1, rnd2, rnd3, rnd4] = useMemo(() => range(4).map(() => Math.random() * 30), [])
  return (
    <Flex justifyContent="space-between" mb={3} width={1}>
      <Box mt={3}>
        <Placeholder height={20} width={100 + rnd1} />
        <Placeholder height={15} mt={2} width={50 + rnd2} />
      </Box>

      <Flex alignItems="flex-end" flexDirection="column" mt={3}>
        <Placeholder height={20} width={100 + rnd3} />
        <Placeholder height={15} mt={2} width={50 + rnd4} />
      </Flex>
    </Flex>
  )
}

const ActivityItem = () => (
  <Box mt={40} px={10} width={1}>
    <Placeholder height={20} width={100} />
    <Bar mt={10} variant="light" width={1} />
    <ActivityGroupRow />
    <ActivityGroupRow />
  </Box>
)

const Loading = ({ isLoading }) => {
  const { height: screenHeight } = useWindowDimensions()
  const ACTIVITY_ITEM_HEIGHT = 150
  const numRows = screenHeight / ACTIVITY_ITEM_HEIGHT

  return (
    <Transition
      config={{ duration: 500, delay: 500 }}
      enter={{ opacity: 1 }}
      from={{ opacity: 1 }}
      items={isLoading}
      leave={{ opacity: 0 }}
      native
    >
      {show =>
        show &&
        // eslint-disable-next-line react/display-name
        (springStyles => (
          <AnimationContainer style={springStyles}>
            <Flex as="article" flexDirection="column" height="100%" width="100%">
              <Card bg="secondaryColor" height={192} p={0} pb={3} pt={4}>
                <Flex
                  alignItems="flex-end"
                  as="header"
                  justifyContent="space-between"
                  mt={2}
                  px={4}
                >
                  <WalletLogo />
                  <Placeholder height={20} mr={3} width={350} />
                </Flex>
                <Flex
                  alignItems="flex-end"
                  as="header"
                  justifyContent="space-between"
                  mb={3}
                  mt={4}
                  px={5}
                >
                  <Box>
                    <Placeholder height={40} mr={3} width={200} />
                    <Placeholder height={20} mr={3} mt={2} width={100} />
                  </Box>

                  <Flex>
                    <Placeholder height={45} mr={3} width={150} />
                    <Placeholder height={45} mr={3} width={150} />
                  </Flex>
                </Flex>
              </Card>
              <Box bg="primaryColor" my={3} px={4}>
                <Placeholder height={50} mr={3} width={1} />
                {range(numRows).map(index => (
                  <ActivityItem key={index} />
                ))}
              </Box>
            </Flex>
          </AnimationContainer>
        ))
      }
    </Transition>
  )
}

Loading.propTypes = {
  isLoading: PropTypes.bool,
}

export default Loading
