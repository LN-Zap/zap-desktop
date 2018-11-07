import React from 'react'

const SvgPaperPlane = props => (
  <svg width="1em" height="1em" viewBox="0 0 22 22" {...props}>
    <g
      stroke="currentColor"
      strokeWidth={0.75}
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 1.5l-11 11M21 1l-7.35 21-4.2-9.45L0 8.35z" />
    </g>
  </svg>
)

export default SvgPaperPlane
