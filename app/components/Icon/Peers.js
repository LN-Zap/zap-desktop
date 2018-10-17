import React from 'react'

const SvgPeers = props => (
  <svg viewBox="0 0 24 19" width="1em" height="1em" {...props}>
    <g
      transform="translate(1 1)"
      stroke="currentColor"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      opacity={0.7}
      strokeLinejoin="round"
    >
      <path d="M16 18v-2a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v2" />
      <circle cx={8} cy={4} r={4} />
      <path d="M22 18v-2a4 4 0 0 0-3-3.87M15 .13a4 4 0 0 1 0 7.75" />
    </g>
  </svg>
)

export default SvgPeers
