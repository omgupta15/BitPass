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

  /* to remove the default outline added by chrome to highlighted input boxes and buttons */
  *:focus {
    outline: none;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 9px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 1rem;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  .App {
    height: 100vh;
    overflow: auto;
    overflow-x: hidden;

    background: linear-gradient(135deg, #6f00ff, #11ff60);
    background-size: 250% 250%; /* increasing the background size to animate the gradient */

    /* starting the animation */
    animation: BackgroundAnimation 25s ease infinite;
  }

  /* animation for moving the linear gradient to show the background effect */
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

  /* overriding min width for material ui icons for better look on the site */
  .MuiListItemIcon-root {
    min-width: 45px !important;
    margin-left: 5px !important;
  }
`;

export default GlobalStyle;
