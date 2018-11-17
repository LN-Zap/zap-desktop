import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

/* eslint-disable max-len */
const GlobalStyle = createGlobalStyle`
  /* stylelint-disable font-family-no-missing-generic-family-keyword  */
  ${reset}

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2) format('woff2');
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
    overflow-y: hidden;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    font-family: 'Roboto', Arial, Helvetica, sans-serif;
    font-weight: 300;
    font-size: 13px;
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
    background: ${props => props.theme.colors.secondaryColor};
    color: ${props => props.theme.colors.primaryText};
    border: 1px solid ${props => props.theme.colors.gray};
    border-radius: 3px;
    max-width: 260px;
    line-height: 1.4;
    padding: 6px 10px;
    word-wrap: break-word;
    box-shadow: 0 3px 4px 0 rgba(30, 30, 30, 0.5), 0 2px 4px 0 rgba(0, 0, 0, 0.5);
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
   *Animated Checkmark
   */

  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: ${props => props.theme.colors.superGreen};
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    box-shadow: inset 0 0 0 ${props => props.theme.colors.superGreen};
    animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scale {
    0%,
    100% {
      transform: none;
    }

    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }

  @keyframes fill {
    100% {
      box-shadow: inset 0 0 0 30px ${props => props.theme.colors.superGreen};
    }
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
