import React from 'react'
import PropTypes from 'prop-types'
import { Card as BaseCard } from 'rebass/styled-components'
import styled from 'styled-components'
import { tint } from 'polished'

const EmptyBar = ({ children, height, ...rest }) => (
  <BaseCard borderRadius={100} color="primaryText" height={height} {...rest}>
    {children}
  </BaseCard>
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
  transition: all 0.25s;
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
