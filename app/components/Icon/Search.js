import React from 'react'

const SvgSearch = props => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="search_svg__feather search_svg__feather-search"
    {...props}
  >
    <circle cx={10.5} cy={10.5} r={7.5} />
    <path d="M21 21l-5.2-5.2" />
  </svg>
)

export default SvgSearch
