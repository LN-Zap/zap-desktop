import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    position: relative;
    overflow-y: hidden;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    font-family: 'Roboto', Arial, Helvetica, sans-serif;
    font-size: 13px;
  }
`

export default GlobalStyle
