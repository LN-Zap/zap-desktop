import React from 'react'

const SvgDownload = props => (
  <svg height="1em" viewBox="0 0 17 18" width="1em" {...props}>
    <g fill="none" fillRule="evenodd" transform="rotate(90 8 8.5)">
      <path
        d="M0 8h14m-5.526 5L14 8 8.474 3"
        stroke="#959595"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        fill="#959595"
        height={1}
        rx={0.5}
        transform="matrix(0 1 1 0 8.5 -8.5)"
        width={16}
        x={8.5}
        y={7.5}
      />
    </g>
  </svg>
)

export default SvgDownload
