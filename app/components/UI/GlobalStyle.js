import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v15/Fl4y0QdOxyyTHEGMXX8kcaCWcynf_cDxXwCLxiixG1c.ttf) format('truetype');
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: 'Roboto Light', 'Roboto', Arial, Helvetica, sans-serif;
    font-size: 13px;
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
  }
`

export default GlobalStyle
