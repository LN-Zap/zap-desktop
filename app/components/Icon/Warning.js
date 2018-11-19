import React from 'react'

const SvgWarning = props => (
  <svg width="1em" height="1em" viewBox="0 0 15 14" {...props}>
    <defs>
      <path
        id="warning_svg__a"
        d="M9.264 1.682l5.105 9.36A2 2 0 0 1 12.613 14H2.403a2 2 0 0 1-1.757-2.958l5.106-9.36a2 2 0 0 1 3.512 0zm-1.689 8.434a.706.706 0 1 0 0 1.412.706.706 0 0 0 0-1.412zm0-5.297a.706.706 0 0 0-.706.706V8.35a.706.706 0 1 0 1.412 0V5.525a.706.706 0 0 0-.706-.706z"
      />
    </defs>
    <use fill="currentColor" fillRule="evenodd" xlinkHref="#warning_svg__a" />
  </svg>
)

export default SvgWarning
