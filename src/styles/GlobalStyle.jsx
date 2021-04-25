import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: "Roboto", sans-serif;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    font-family: "Roboto", sans-serif;
  }

  *:focus {
    outline: none;
  }

  .App {
    height: 100vh;
    overflow: auto;
    background: linear-gradient(135deg, #6f00ff, #11ff60);
    background-size: 250% 250%;

    /*
    animation: BackgroundAnimation 25s ease infinite;
    */
  }

  @keyframes BackgroundAnimation {
    0% {
      background-position: 0% 49%;
    }
    50% {
      background-position: 100% 52%;
    }
    100% {
      background-position: 0% 49%;
    }
  }

  .MuiListItemIcon-root {
    min-width: 45px !important;
    margin-left: 5px !important;
  }
`;

export default GlobalStyle;
