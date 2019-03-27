import React from 'react'

const SvgCheck = props => (
  <svg
    className="check_svg__feather check_svg__feather-check"
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
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export default SvgCheck
