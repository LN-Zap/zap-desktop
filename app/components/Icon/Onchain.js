import React from 'react'

const SvgOnchain = props => (
  <svg viewBox="0 0 50 50" width="1em" height="1em" {...props}>
    <defs>
      <linearGradient id="c" x1="0%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#FFBD59" />
        <stop offset="100%" stopColor="#FD9800" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <circle cx={25} cy={25} r={25} fill="url(#c)" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23 26.675c.946 1.347 2.394 2.19 3.97 2.31 1.574.12 3.12-.494 4.237-1.684l3.265-3.477c2.063-2.275 2.033-5.89-.066-8.126-2.1-2.236-5.494-2.268-7.63-.07l-1.871 1.982"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M27 24.325c-.946-1.347-2.394-2.19-3.97-2.31-1.574-.12-3.12.494-4.237 1.684l-3.265 3.477c-2.063 2.275-2.033 5.89.066 8.126 2.1 2.236 5.494 2.268 7.63.07l1.86-1.982"
      />
    </g>
  </svg>
)

export default SvgOnchain
