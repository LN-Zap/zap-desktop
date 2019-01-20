import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import { Heading, Text } from 'components/UI'
import PlusCircle from 'components/Icon/PlusCircle'

const Header = ({ title, openContactsForm, hint }) => (
  <Flex justifyContent="space-between" mx={3}>
    <Heading.h4 fontWeight="normal" mb={3}>
      <FormattedMessage {...title} />
    </Heading.h4>
    <Box
      onClick={openContactsForm}
      className="hint--right"
      data-hint={hint}
      css={{ cursor: 'pointer', '&:hover': { opacity: 0.5 } }}
      width={1 / 2}
    >
      <Text fontSize="22px" textAlign="right">
        <PlusCircle />
      </Text>
    </Box>
  </Flex>
)

Header.propTypes = {
  title: PropTypes.object.isRequired,
  openContactsForm: PropTypes.func.isRequired,
  hint: PropTypes.string.isRequired
}

export default Header
