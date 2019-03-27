import React from 'react'

const SvgPlus = props => (
  <svg
    className="plus_svg__feather plus_svg__feather-plus"
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
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export default SvgPlus
