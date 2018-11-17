import React from 'react'

const SvgPlusCircle = props => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <g fill="none" fillRule="evenodd" stroke="currentColor" transform="translate(1 1)">
      <path d="M11.121 7v8M7 11.121h8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={11} cy={11} r={11} />
    </g>
  </svg>
)

export default SvgPlusCircle
