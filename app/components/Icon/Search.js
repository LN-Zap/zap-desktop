import React from 'react'

const SvgSearch = props => (
  <svg
    className="search_svg__feather search_svg__feather-search"
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
    <circle cx={10.5} cy={10.5} r={7.5} />
    <path d="M21 21l-5.2-5.2" />
  </svg>
)

export default SvgSearch
