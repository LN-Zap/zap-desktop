import React from 'react'

const SvgNetwork = props => (
  <svg height="1em" viewBox="0 0 18 18" width="1em" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.8}
      transform="translate(1 1)"
    >
      <circle cx={8} cy={8} r={8} />
      <path d="M0 8h16M8 0c1.876 2.19 2.942 5.034 3 8-.058 2.966-1.124 5.81-3 8-1.876-2.19-2.942-5.034-3-8 .058-2.966 1.124-5.81 3-8z" />
    </g>
  </svg>
)

export default SvgNetwork
