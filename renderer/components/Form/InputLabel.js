import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { Span, Tooltip } from 'components/UI'
import Label from './Label'

const Supertext = styled(Span)`
  vertical-align: top;
`

const RequiredMark = () => (
  <Supertext fontSize="s" ml={1}>
    *
  </Supertext>
)

const InputLabel = ({ field, children, isRequired, tooltip, ...rest }) => (
  <Flex mb={2} {...rest}>
    <Label htmlFor={field}>
      {children}
      {isRequired && <RequiredMark />}
    </Label>
    {tooltip && <Tooltip ml={1}>{tooltip}</Tooltip>}
  </Flex>
)

InputLabel.propTypes = {
  children: PropTypes.node,
  field: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  tooltip: PropTypes.string,
}

export default InputLabel
