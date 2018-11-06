import React from 'react'

const SvgCheckCircle = props => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={0.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="check-circle_svg__feather check-circle_svg__feather-check-circle"
    {...props}
  >
    <path d="M22 11.07V12a10 10 0 1 1-5.93-9.14" />
    <path d="M23 3L12 14l-3-3" />
  </svg>
)

export default SvgCheckCircle
