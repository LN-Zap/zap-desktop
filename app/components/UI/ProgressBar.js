import React from 'react'
import PropTypes from 'prop-types'
import { Card as BaseCard } from 'rebass'
import system from '@rebass/components'
import styled from 'styled-components'
import { tint } from 'polished'

const SystemCard = system({ extend: BaseCard }, 'height')

const EmptyBar = ({ children, ...rest }) => (
  <SystemCard borderRadius={8} color="primaryText" height={10} {...rest}>
    {children}
  </SystemCard>
)

EmptyBar.propTypes = {
  children: PropTypes.node,
}

const FilledBar = styled(EmptyBar)`
  background: linear-gradient(
    to ${props => (props.justify === 'right' ? 'right' : 'left')},
    ${props => tint(0.3, props.theme.colors[props.bg])},
    ${props => props.theme.colors[props.bg]}
  );
  margin-left: ${props => (props.justify === 'right' ? 'auto' : 'none')};
`

const ProgressBar = ({ progress, color, bg, justify, ...rest }) => (
  <EmptyBar bg={bg} {...rest}>
    {progress > 0 && <FilledBar bg={color} justify={justify} width={progress} />}
  </EmptyBar>
)

ProgressBar.propTypes = {
  bg: PropTypes.string,
  color: PropTypes.string,
  justify: PropTypes.string,
  progress: PropTypes.number,
}

ProgressBar.defaultProps = {
  progress: 0,
  bg: 'tertiaryColor',
  color: 'lightningOrange',
  justify: 'left',
}

export default ProgressBar
