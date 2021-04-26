import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  height: 100vh;
  width: 100vw;

  .logo {
    width: 20rem;
    max-width: 70vw;
    margin-bottom: 1.5rem;

    img {
      width: 100%;
    }
  }

  .form {
    /* height: 30rem; */
    width: 50rem;
    max-width: 90vw;

    background: rgb(240, 240, 240);
    border-radius: 0.5rem;
    box-shadow: 0 0 1rem 0.05rem rgba(0, 0, 0, 0.3);

    padding: 2.5rem;
    box-sizing: border-box;

    .top-link {
      /* margin-top: 0.75rem; */
      width: 100%;
      margin-bottom: 1rem;
      box-sizing: border-box;
      text-align: left;
      /* position: absolute; */

      a {
        text-decoration: none;
        color: #504f4f;
        font-weight: 500;
        transition: 0.25s;

        span:first-child {
          margin-right: 0.25rem;
        }

        @media all and (max-width: 400px) {
          span:last-child {
            display: block;
          }
        }
      }

      a:hover:not([disabled]),
      a:focus:not([disabled]) {
        color: #606060;
        /* text-decoration: underline; */
      }
    }

    @media all and (max-width: 500px) {
      & {
        padding: 2.5rem 1rem;
      }
      .top-link {
        padding-left: 0.5rem;
      }
    }

    @media all and (max-width: 400px) {
      & {
        padding: 2.5rem 0.5rem;
      }
    }

    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 2.1rem;
      font-weight: 500;
    }

    .form-fields-container {
      margin: 2rem;
      padding: 1rem;
      padding-bottom: 0rem;
      box-sizing: border-box;
      width: 50%;

      @media all and (max-width: 400px) {
        & {
          padding: 1rem 0.75rem;
          margin-bottom: 1rem;
        }
      }

      @media all and (max-width: 900px) {
        & {
          width: 60%;
        }
      }

      @media all and (max-width: 700px) {
        & {
          width: 70%;
        }
      }

      @media all and (max-width: 600px) {
        & {
          width: 100%;
        }
      }

      /* .text-field {
        margin-bottom: 1.75rem;
        font-size: 1.2rem;
        text-align: center;
      } */

      .form-field {
        margin-bottom: 1.5rem;
        width: 100%;
        text-align: center;

        .form-field-file-input {
          box-sizing: border-box;
          border: 1px solid rgba(100, 100, 100, 0.5);
          padding: 12px 14px;
          border-radius: 4px;
        }

        .form-field-file-input:hover {
          border-color: black;
        }

        .form-field-file-input.error {
          border-color: #f44336;
        }

        .helper-text.error {
          color: #f44336;
        }

        .form-field-input {
          width: 100%;
        }
      }

      .form-field:last-child {
        margin-bottom: 0;
      }

      .submit-button-wrapper {
        width: 100%;
        text-align: center;

        .submit-buttom {
          display: flex;
          margin: auto;
          align-items: center;
          justify-content: center;

          span {
            display: inline-block;
            margin-left: 0.15rem;
            margin-right: 0.3rem;
            transition: 0.25s;
          }

          cursor: pointer;
          border: none;
          padding: 0.5rem 1rem;
          font-size: 1.25rem;
          color: white;
          border-radius: 0.5rem;

          background: linear-gradient(90deg, #6f00ff, #11ff60);
          background-size: 250% 250%;

          animation: ButtonBackgroundAnimation 2s ease infinite alternate;

          transition: all 0.3s ease-in-out;

          &[disabled] {
            cursor: progress;
            animation-duration: 0.5s;

            span {
              margin-left: 0.5rem;
              margin-right: 0;
            }
          }

          &:hover:not([disabled]),
          &:focus:not([disabled]) {
            padding: 1rem 2rem;
            font-size: 1.5rem;
            border-radius: 10rem;

            span {
              margin-right: 1rem;
              animation: ButtonMarginAnimation 1s ease infinite alternate;
            }
            svg {
              font-size: 1.75rem;
            }

            @keyframes ButtonMarginAnimation {
              0% {
                margin-right: 0.3rem;
              }
              50% {
                margin-right: 1rem;
              }
              100% {
                margin-right: 0.3rem;
              }
            }

            animation: ButtonBackgroundAnimation 1s ease infinite alternate;
          }

          @keyframes ButtonBackgroundAnimation {
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
        }
      }
    }

    .bottom-links {
      .link {
        margin-bottom: 0.5rem;
        text-align: center;

        a {
          text-decoration: none;
          color: #504f4f;
          font-weight: 500;
          transition: 0.25s;

          span:first-child {
            margin-right: 0.25rem;
          }

          @media all and (max-width: 400px) {
            span:last-child {
              display: block;
            }
          }
        }

        a:hover:not([disabled]),
        a:focus:not([disabled]) {
          color: #606060;
          text-decoration: underline;
        }
      }

      .link:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

export default StyledForm;
