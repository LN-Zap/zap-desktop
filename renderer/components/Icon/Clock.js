import React from 'react'

const SvgClock = props => (
  <svg
    className="clock_svg__feather clock_svg__feather-clock"
    fill="none"
    height="1em"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <path d="M12 6v6l3 3" />
  </svg>
)

export default SvgClock
