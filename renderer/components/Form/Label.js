import React from 'react'

import { Label as BaseLabel } from '@rebass/forms/styled-components'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import { Span, Tooltip } from 'components/UI'

const Supertext = styled(Span)`
  vertical-align: top;
`

const RequiredMark = () => (
  /* eslint-disable shopify/jsx-no-hardcoded-content */
  <Supertext fontSize="s" ml={1}>
    *
  </Supertext>
  /* eslint-enable shopify/jsx-no-hardcoded-content */
)

const Label = ({ htmlFor, children, isRequired, tooltip, ...rest }) => (
  <BaseLabel htmlFor={htmlFor} {...rest}>
    <Flex>
      <Box>{children}</Box>
      {isRequired && <RequiredMark />}
      {tooltip && <Tooltip ml={1}>{tooltip}</Tooltip>}
    </Flex>
  </BaseLabel>
)

Label.propTypes = {
  children: PropTypes.node.isRequired,
  htmlFor: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  tooltip: PropTypes.string,
}

export default Label
