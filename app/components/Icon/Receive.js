import React from 'react'

const SvgReceive = props => (
  <svg height="1em" viewBox="0 0 50 50" width="1em" {...props}>
    <defs>
      <linearGradient id="receive_svg__a" x1="0%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#FFBD59" />
        <stop offset="100%" stopColor="#FD9800" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <circle cx={25} cy={25} fill="url(#receive_svg__a)" r={25} />
      <path d="M25.488 40L30 31l-9 .012z" stroke="currentColor" />
      <path d="M25 31h1V10h-1z" fill="currentColor" />
    </g>
  </svg>
)

export default SvgReceive
