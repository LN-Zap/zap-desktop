import React from 'react'

const SvgLightning = props => (
  <svg width="1em" height="1em" viewBox="0 0 50 50" {...props}>
    <defs>
      <linearGradient id="lightning_svg__a" x1="0%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#FFBD59" />
        <stop offset="100%" stopColor="#FD9800" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <circle cx={25} cy={25} r={25} fill="url(#lightning_svg__a)" />
      <path
        stroke="currentColor"
        d="M26.483 22.591h6.276L22.12 39.261l2.67-11.34h-6.728L29.11 11.433l-2.628 11.158z"
      />
    </g>
  </svg>
)

export default SvgLightning
