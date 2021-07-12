import React, { useMemo } from 'react'

import range from 'lodash/range'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass/styled-components'

import ZapLogo from 'components/Icon/ZapLogo'
import { Card, Bar } from 'components/UI'
import CloseButton from 'components/UI/CloseButton'
import { useWindowDimensions } from 'hooks'

import Placeholder from './Placeholder'
import Transition from './Transition'

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

const Loading = ({ isLoading, hasClose, onClose }) => {
  const { height: screenHeight } = useWindowDimensions()
  const ACTIVITY_ITEM_HEIGHT = 150
  const numRows = screenHeight / ACTIVITY_ITEM_HEIGHT

  return (
    <Transition isLoading={isLoading}>
      <Flex as="article" bg="primaryColor" flexDirection="column" height="100%" width="100%">
        <Card bg="secondaryColor" height={192} p={0} pb={3} pt={4}>
          <Flex alignItems="flex-end" as="header" justifyContent="space-between" mt={2} px={4}>
            <ZapLogo height={28} width={28} />
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
        <Box my={3} px={4}>
          <Placeholder height={50} mr={3} width={1} />
          {range(numRows).map(index => (
            <ActivityItem key={index} />
          ))}
        </Box>
        {hasClose && (
          <CloseButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }} />
        )}
      </Flex>
    </Transition>
  )
}

Loading.propTypes = {
  hasClose: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
}

export default Loading
