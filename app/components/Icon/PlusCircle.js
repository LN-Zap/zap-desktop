import React from 'react'

const SvgPlusCircle = props => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="plus-circle_svg__feather plus-circle_svg__feather-plus-circle"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <path d="M12 8v8M8 12h8" />
  </svg>
)

export default SvgPlusCircle
