import React from 'react'
import PropTypes from 'prop-types'
import { Card as BaseCard } from 'rebass'
import system from '@rebass/components'
import styled from 'styled-components'
import { tint } from 'polished'

const SystemCard = system({ extend: BaseCard }, 'height')

const EmptyBar = ({ children, height, ...rest }) => (
  <SystemCard borderRadius={100} color="primaryText" height={height} {...rest}>
    {children}
  </SystemCard>
)

EmptyBar.propTypes = {
  children: PropTypes.node,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

const FilledBar = styled(EmptyBar)`
  background: linear-gradient(
    to ${props => (props.justify === 'right' ? 'right' : 'left')},
    ${props => tint(0.3, props.theme.colors[props.bg])},
    ${props => props.theme.colors[props.bg]}
  );
  margin-left: ${props => (props.justify === 'right' ? 'auto' : 'none')};
`

const ProgressBar = ({ progress, color, height, bg, justify, children, ...rest }) => (
  <EmptyBar bg={bg} {...rest} height={height}>
    {progress > 0 && (
      <FilledBar bg={color} height={height} justify={justify} width={progress}>
        {children}
      </FilledBar>
    )}
  </EmptyBar>
)

ProgressBar.propTypes = {
  bg: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  justify: PropTypes.string,
  progress: PropTypes.number,
}

ProgressBar.defaultProps = {
  progress: 0,
  height: 10,
  bg: 'tertiaryColor',
  color: 'lightningOrange',
  justify: 'left',
}

export default ProgressBar
