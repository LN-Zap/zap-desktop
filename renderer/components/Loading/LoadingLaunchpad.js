import React from 'react'

import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'

import ZapLogo from 'components/Icon/ZapLogo'
import { Bar, MainContent, Sidebar } from 'components/UI'

import Placeholder from './Placeholder'
import Transition from './Transition'

const Loading = ({ isLoading }) => {
  return (
    <Transition isLoading={isLoading}>
      <Flex bg="primaryColor" height="100%">
        <Sidebar.Medium height="100%" pl={4} pt={40}>
          <Box mb={40}>
            <ZapLogo height={28} width={28} />
          </Box>
          <Placeholder height={15} mb={3} width={170} />
          <Placeholder height={15} mb={3} width={100} />
          <Placeholder height={15} mb={3} width={100} />
          <Placeholder height={15} mb={3} width={100} />
          <Placeholder height={15} mb={3} width={100} />
        </Sidebar.Medium>
        <MainContent height="100%" pb={2} pl={5} pr={6} pt={4} width={1}>
          <Flex alignItems="center" justifyContent="space-between" mb={5} width={1}>
            <Placeholder height={60} width={2 / 3} />
            <Placeholder height={40} ml={5} width={150} />
          </Flex>
          <Placeholder height={25} mb={5} width={200} />
          <Placeholder height={15} mb={10} width={150} />
          <Bar mb={5} variant="light" width={1} />
          <Placeholder height={15} mb={3} width={120} />
          <Placeholder height={15} mb={3} width={140} />
          <Placeholder height={15} mb={6} width={150} />
          <Placeholder height={15} mb={10} width={150} />
          <Bar mb={5} variant="light" width={1} />
          <Placeholder height={15} mb={4} width={1} />
          <Placeholder height={15} mb={4} width={1} />
        </MainContent>
      </Flex>
    </Transition>
  )
}

Loading.propTypes = {
  isLoading: PropTypes.bool,
}

export default Loading
