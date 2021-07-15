import { themeGet } from '@styled-system/theme-get'
import { rgba } from 'polished'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

import RobotoLight from '@zap/fonts/roboto-light.woff2'
import RobotoRegular from '@zap/fonts/roboto-regular.woff2'

/* eslint-disable max-len */
const GlobalStyle = createGlobalStyle`
  /* stylelint-disable font-family-no-missing-generic-family-keyword  */
  ${reset}

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: local('Roboto Light'), local('Roboto-Light'), url('${RobotoLight}') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: local('Roboto'), local('Roboto-Regular'), url('${RobotoRegular}') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  html {
    box-sizing: border-box;
    height: 100%;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    height: 100%;
    position: relative;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    font-family: 'Roboto', Arial, Helvetica, sans-serif;
    font-weight: 300;
    font-size: 13px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => rgba(themeGet('colors.primaryText')(props), 0.12)};
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => rgba(themeGet('colors.primaryText')(props), 0.4)};
    border-radius: 4px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  pre {
    font-family: "Lucida Console", Monaco, monospace;
  }

  #root {
    height: 100%;
  }

  .element-show {
    display: inherit;
  }

  .element-hide {
    display: none;
  }

  /*
   *Tooltips
   */
  [data-hint] {
    position: relative;
  }

  [data-hint]::before,
  [data-hint]::after {
    position: absolute;
    will-change: transform;
    visibility: hidden;
    opacity: 0;
    z-index: 999;
    pointer-events: none;
    transition: 0.2s ease;
    transition-delay: 0ms;
  }

  [data-hint]::before {
    content: '';
    position: absolute;
    background: transparent;
    border: 6px solid transparent;
    z-index: 999;
  }

  [data-hint]::after {
    content: attr(data-hint);
    background: ${themeGet('colors.secondaryColor')};
    color: ${themeGet('colors.primaryText')};
    border: 1px solid ${themeGet('colors.gray')};
    border-radius: 3px;
    max-width: 260px;
    line-height: 1.4;
    padding: 6px 10px;
    word-wrap: break-word;
    box-shadow: ${themeGet('shadows.s')};
  }

  [data-hint]:hover::before,
  [data-hint]:hover::after {
    visibility: visible;
    opacity: 1;
  }

  .hint--bottom::before,
  .hint--bottom-left::before,
  .hint--bottom-right::before {
    border-bottom-color: #404040;
  }

  .hint--top::before,
  .hint--top-left::before,
  .hint--top-right::before {
    border-top-color: #404040;
  }

  .hint--bottom::before {
    margin-top: -12px;
  }

  .hint--bottom::after {
    margin-left: -18px;
  }

  .hint--bottom::before,
  .hint--bottom::after {
    top: 100%;
    left: 50%;
  }

  .hint--bottom:hover::after,
  .hint--bottom:hover::before {
    transform: translateY(8px);
  }

  .hint--top::before {
    margin-bottom: -12px;
  }

  .hint--top::after {
    margin-left: -18px;
  }

  .hint--top::before,
  .hint--top::after {
    bottom: 100%;
    left: 50%;
  }

  .hint--top:hover::after,
  .hint--top:hover::before {
    transform: translateY(-8px);
  }

  .hint--top-left::before,
  .hint--top-right::before {
    margin-bottom: -12px;
  }

  .hint--top-left::after {
    margin-right: -6px;
  }

  .hint--top-right::after {
    margin-right: 6px;
  }

  .hint--top-left::before,
  .hint--top-left::after {
    bottom: 100%;
    right: 12px;
  }

  .hint--top-right::before,
  .hint--top-right::after {
    bottom: 100%;
    left: 12px;
  }

  .hint--top-left:hover::after,
  .hint--top-left:hover::before,
  .hint--top-right:hover::after,
  .hint--top-right:hover::before {
    transform: translateY(-8px);
  }

  .hint--bottom-left::before {
    margin-top: -12px;
  }

  .hint--bottom-left::after {
    margin-right: -6px;
  }

  .hint--bottom-left::before,
  .hint--bottom-left::after {
    top: 100%;
    right: 12px;
  }

  .hint--bottom-left:hover::after,
  .hint--bottom-left:hover::before {
    transform: translateY(8px);
  }

  .hint--left::before {
    margin-right: -12px;
    margin-top: -6px;
  }

  .hint--left::after {
    margin-right: -14px;
  }

  .hint--left::before,
  .hint--left::after {
    right: 100%;
    bottom: 50%;
  }

  .hint--left:hover::after,
  .hint--left:hover::before {
    transform: translateX(-8px);
  }

  /*
   *Generic spin animation.
   */

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`

export default GlobalStyle
