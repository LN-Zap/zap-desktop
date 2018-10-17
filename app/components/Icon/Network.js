import React from 'react'

const SvgNetwork = props => (
  <svg viewBox="0 0 18 18" width="1em" height="1em" {...props}>
    <g
      transform="translate(1 1)"
      stroke="currentColor"
      strokeWidth={0.8}
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={8} cy={8} r={8} />
      <path d="M0 8h16M8 0c1.876 2.19 2.942 5.034 3 8-.058 2.966-1.124 5.81-3 8-1.876-2.19-2.942-5.034-3-8 .058-2.966 1.124-5.81 3-8z" />
    </g>
  </svg>
)

export default SvgNetwork
