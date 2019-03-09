import React from 'react'

const SvgCopy = props => (
  <svg
    className="copy_svg__feather copy_svg__feather-copy"
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
    <rect height={13} rx={2} ry={2} width={13} x={9} y={9} />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

export default SvgCopy
