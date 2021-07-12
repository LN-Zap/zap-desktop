import React, { useContext } from 'react'

import { themeGet } from '@styled-system/theme-get'
import { tint } from 'polished'
import PropTypes from 'prop-types'
import { ThemeContext } from 'styled-components'

const Segment = ({ color, strokeWidth, amount = 0, rotate, ...rest }) => {
  const radius = 17.5
  const circumference = 2 * Math.PI * radius
  return (
    <circle
      className="donut-segment"
      cx="20"
      cy="20"
      fill="transparent"
      r={radius}
      stroke={color}
      strokeDasharray={circumference}
      strokeDashoffset={circumference * (1 - amount)}
      strokeWidth={strokeWidth}
      transform={`rotate(-${rotate} 20 20)`}
      {...rest}
    />
  )
}

Segment.propTypes = {
  amount: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  rotate: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
}

const Donut = ({ data, text, strokeWidth, ...rest }) => {
  const theme = useContext(ThemeContext)
  const initialRotation = 90
  let cumRotation = initialRotation

  // Add an additioanl segment for the base layer
  const allData = [{ key: '__base__', amount: 1, color: 'tertiaryColor' }, ...data]

  // Set rotation for each segment.
  const segments = allData.map(item => {
    const segment = { ...item, rotate: cumRotation }
    const offset = 360 * (1 - item.amount)
    cumRotation += offset
    return segment
  })

  return (
    <svg height="100%" viewBox="0 0 40 40" width="100%" {...rest}>
      {segments.map(segment => {
        const color = themeGet(`colors.${segment.color}`)({ theme })
        return (
          <React.Fragment key={segment.key}>
            <defs>
              <linearGradient id={`gradient-${segment.key}`} x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor={tint(0.2, color)} />
                <stop offset="100%" stopColor={color} />
              </linearGradient>

              <filter height="150%" id={`glow-${segment.key}`} width="150%">
                {/* Thicken out the original shape  */}
                <feMorphology in="SourceAlpha" operator="dilate" radius="0.3" result="thicken" />

                {/* Use a gaussian blur to create the soft blurriness of the glow */}
                <feGaussianBlur in="thicken" result="blurred" stdDeviation="1" />

                {/* Change the color */}
                <feFlood floodColor={color} result="glowColor" />

                {/* Color in the glows */}
                <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />

                {/* Layer the effects together */}
                <feMerge>
                  <feMergeNode in="softGlow_colored" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <Segment
              amount={segment.amount}
              color={
                segment.withTint
                  ? `url(#gradient-${segment.key})`
                  : themeGet(`colors.${segment.color}`)({ theme })
              }
              filter={segment.withGlow ? `url(#glow-${segment.key})` : null}
              rotate={segment.rotate}
              strokeWidth={strokeWidth}
            />
          </React.Fragment>
        )
      })}

      <text fill={themeGet('colors.primaryText')({ theme })} transform="translate(0, 5)" y="50%">
        <tspan textAnchor="middle" x="50%">
          {text}
        </tspan>
      </text>
    </svg>
  )
}

Donut.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      color: PropTypes.string,
      key: PropTypes.string.isRequired,
      withGlow: PropTypes.bool,
      withTint: PropTypes.bool,
    })
  ),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  strokeWidth: PropTypes.number,
  text: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

Donut.defaultProps = {
  data: [],
  strokeWidth: 1,
}

Donut.displayName = 'Donut'

export default Donut
