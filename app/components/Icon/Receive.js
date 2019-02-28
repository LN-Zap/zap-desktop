import React from 'react'

const SvgReceive = props => (
  <svg width="1em" height="1em" viewBox="0 0 50 50" {...props}>
    <defs>
      <linearGradient id="receive_svg__a" x1="0%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#FFBD59" />
        <stop offset="100%" stopColor="#FD9800" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <circle cx={25} cy={25} r={25} fill="url(#receive_svg__a)" />
      <path stroke="currentColor" d="M25.488 40L30 31l-9 .012z" />
      <path fill="currentColor" d="M25 31h1V10h-1z" />
    </g>
  </svg>
)

export default SvgReceive
