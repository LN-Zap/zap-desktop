import React from 'react'

const SvgFilter = props => (
  <svg height="1em" viewBox="0 0 14 13" width="1em" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(1)">
      <circle cx={9} cy={6.5} fill="currentColor" r={1.5} />
      <circle cx={6} cy={1.5} fill="currentColor" r={1.5} />
      <circle cx={3} cy={11.5} fill="currentColor" r={1.5} />
      <path
        d="M0 1.5h12m-12 5h12m-12 5h12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.813}
      />
    </g>
  </svg>
)

export default SvgFilter
