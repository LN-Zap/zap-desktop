import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  body {
    position: relative;
    overflow-y: hidden;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    font-family: 'Roboto', Arial, Helvetica, sans-serif;
  }
`

export default GlobalStyle
