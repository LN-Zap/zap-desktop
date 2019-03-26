import React from 'react'

const SvgSpinner = props => (
  <svg height="1em" viewBox="0 0 14 14" width="1em" {...props}>
    <defs>
      <path
        d="M0 7a.778.778 0 1 1 1.556 0c0 1.464.58 2.835 1.594 3.85a5.444 5.444 0 1 0 1.766-8.881A.778.778 0 1 1 4.32.53 7 7 0 1 1 0 7z"
        id="spinner_svg__a"
      />
    </defs>
    <use fill="currentColor" xlinkHref="#spinner_svg__a" />
  </svg>
)

export default SvgSpinner
