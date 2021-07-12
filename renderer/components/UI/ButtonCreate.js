import React from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import PlusCircle from 'components/Icon/PlusCircle'
import Button from 'components/UI/Button'
import Text from 'components/UI/Text'

const Icon = props => <PlusCircle height="22px" width="22px" {...props} />
const IconWrapper = props => <Text color="primaryAccent" {...props} />
const ContentWrapper = props => <Text fontWeight="light" lineHeight="22px" {...props} />

const ButtonCreate = ({ children, justify, ...rest }) => (
  <Button py={0} size="small" variant="secondary" {...rest}>
    <Flex alignItem="center">
      {justify === 'left' && (
        <>
          <IconWrapper mr={2}>
            <Icon />
          </IconWrapper>
          <ContentWrapper>{children}</ContentWrapper>
        </>
      )}
      {justify === 'right' && (
        <>
          <ContentWrapper>{children}</ContentWrapper>
          <IconWrapper ml={2}>
            <Icon />
          </IconWrapper>
        </>
      )}
    </Flex>
  </Button>
)

ButtonCreate.propTypes = {
  children: PropTypes.node,
  justify: PropTypes.oneOf(['left', 'right']),
}

ButtonCreate.defaultProps = {
  justify: 'left',
}

export default ButtonCreate
