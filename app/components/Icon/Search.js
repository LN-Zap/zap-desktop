import React from 'react'

const SvgSearch = props => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-search"
    width="1em"
    height="1em"
    {...props}
  >
    <circle cx={10.5} cy={10.5} r={7.5} />
    <path d="M21 21l-5.2-5.2" />
  </svg>
)

export default SvgSearch
