import React from 'react'

const SvgLitecoin = props => (
  <svg width="1em" height="1em" viewBox="0 0 50 50" {...props}>
    <defs>
      <linearGradient id="litecoin_svg__a" x1="0%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#FFBD59" />
        <stop offset="100%" stopColor="#FD9800" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <circle cx={25} cy={25} r={25} fill="url(#litecoin_svg__a)" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24.135 32.18l1.495-5.534 3.538-1.271.88-3.253-.03-.08-3.483 1.251L29.045 14h-7.117l-3.282 12.128-2.74.984L15 30.465l2.738-.983-1.934 7.147h18.942l1.214-4.448H24.135"
      />
    </g>
  </svg>
)

export default SvgLitecoin
