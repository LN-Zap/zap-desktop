import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'
import { Card as BaseCard, Radio, Text, Heading } from 'components/UI'

import ConnectOnboarding from 'components/Icon/ConnectOnboarding'
import ImportOnboarding from 'components/Icon/ImportOnboarding'
import PlusOnboarding from 'components/Icon/PlusOnboarding'
import BoltOnboarding from 'components/Icon/BoltOnboarding'

import { animated, Transition } from 'react-spring'

const Card = styled(BaseCard)`
  position: relative;
  height: 210px;
  width: 160px;
  border-radius: 40px;
  padding: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`
const Container = styled(Flex)`
  cursor: pointer;
  position: relative;
  width: 160px;
`

const BoltContainer = styled(animated.div)`
  position: absolute;
  top: -38px;
  left: 9px;
`

const ICONS = {
  create: PlusOnboarding,
  custom: ConnectOnboarding,
  import: ImportOnboarding,
}

const ConnectionTypeItem = ({ fieldApi, value, label, description, ...rest }) => {
  const Icon = ICONS[value] || PlusOnboarding
  const isSelected = fieldApi.getValue() === value
  return (
    <Container
      alignItems="center"
      flexDirection="column"
      {...rest}
      onClick={() => fieldApi.setValue(value)}
    >
      <Card mb={3}>
        <Flex alignItems="center" css={{ height: '100%' }} justifyContent="center">
          <Box color={isSelected ? 'lightningOrange' : 'white'}>
            <Icon height="80px" width="80px" />
          </Box>
        </Flex>
      </Card>

      <Radio px={0} value={value} width={16} />

      <Heading.h1 mb={2} mt={3}>
        {label}
      </Heading.h1>
      <Text color="gray" textAlign="center">
        {description}
      </Text>
      {isSelected && (
        <Transition
          enter={{ opacity: 1 }}
          from={{ opacity: 0 }}
          items={isSelected}
          keys={item => item.id}
        >
          {show =>
            show &&
            /* eslint-disable react/display-name */
            (styles => (
              <BoltContainer style={styles}>
                <BoltOnboarding height="290px" width="180px" />
              </BoltContainer>
            ))
          }
        </Transition>
      )}
    </Container>
  )
}

ConnectionTypeItem.displayName = 'ConnectionTypeItem'

ConnectionTypeItem.propTypes = {
  description: PropTypes.object.isRequired,
  fieldApi: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
}

export default ConnectionTypeItem
