import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'
import Radio from 'components/UI/Radio'
import Text from 'components/UI/Text'
import Heading from 'components/UI/Heading'
import BaseCard from 'components/UI/Card'

import BoltOnboarding from 'components/Icon/BoltOnboarding'

import { animated, Transition } from 'react-spring/renderprops'

const Card = styled(BaseCard)`
  position: relative;
  height: 215px;
  width: 170px;
  border-radius: 40px;
  padding: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`
const Container = styled(Flex)`
  cursor: ${props => (props.isDisabled ? 'auto' : 'pointer')};
  position: relative;
  width: 170px;
`

const BoltContainer = styled(animated.div)`
  position: absolute;
  top: -38px;
  left: 12px;
`

const RadioCard = ({ fieldApi, icons, value, label, isDisabled, description, ...rest }) => {
  const { icon: Icon, width: iconWidth, height: iconHeight } = icons[value]
  const isSelected = fieldApi.getValue() === value
  return (
    <Container
      alignItems="center"
      flexDirection="column"
      {...rest}
      isDisabled={isDisabled}
      onClick={() => !isDisabled && fieldApi.setValue(value)}
    >
      <Card mb={3}>
        <Flex alignItems="center" css={{ height: '100%' }} justifyContent="center">
          <Box color={isSelected ? 'lightningOrange' : 'white'}>
            <Icon height={iconHeight} width={iconWidth} />
          </Box>
        </Flex>
      </Card>

      <Radio isDisabled={isDisabled} px={0} value={value} width={16} />

      <Heading.h1 color={isDisabled ? 'gray' : 'primaryText'} mb={2} mt={3}>
        {label}
      </Heading.h1>
      {description && (
        <Text color="gray" textAlign="center">
          {description}
        </Text>
      )}
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
                <BoltOnboarding height="295px" width="190px" />
              </BoltContainer>
            ))
          }
        </Transition>
      )}
    </Container>
  )
}

RadioCard.displayName = 'RadioCard'

RadioCard.propTypes = {
  description: PropTypes.object,
  fieldApi: PropTypes.object.isRequired,
  icons: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
  label: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
}

export default RadioCard
