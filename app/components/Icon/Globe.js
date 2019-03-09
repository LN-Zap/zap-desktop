import React from 'react'

const SvgGlobe = props => (
  <svg
    className="globe_svg__feather globe_svg__feather-globe"
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
    <circle cx={12} cy={12} r={10} />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

export default SvgGlobe
