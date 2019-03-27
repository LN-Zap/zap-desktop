import React from 'react'

const SvgAutopay = props => (
  <svg height="1em" viewBox="0 0 51 51" width="1em" {...props}>
    <defs>
      <linearGradient id="autopay_svg__a" x1="10.758%" x2="84.247%" y1="17.396%" y2="84.871%">
        <stop offset="0%" stopColor="#008DFD" />
        <stop offset="100%" stopColor="#005DFC" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <circle cx={25.5} cy={25.5} fill="url(#autopay_svg__a)" r={25.5} />
      <g stroke="currentColor">
        <path d="M21.285 14.87c-4.933 2.032-7.969 7.298-7.005 12.786a11.6 11.6 0 0 0 2.916 5.894m8.509-20.22l-3.497 3.84-1.662-4.345zM30.543 36.13c4.933-2.032 7.969-7.298 7.005-12.786a11.6 11.6 0 0 0-2.916-5.894m-8.509 20.22l3.497-3.84 1.662 4.345z" />
      </g>
    </g>
  </svg>
)

export default SvgAutopay
