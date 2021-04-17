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
    margin-bottom: 1.5rem;

    img {
      width: 100%;
    }
  }

  .form {
    /* height: 30rem; */
    width: 50rem;

    background: rgb(240, 240, 240);
    border-radius: 0.5rem;
    box-shadow: 0 0 1rem 0.05rem rgba(0, 0, 0, 0.3);

    padding: 2.5rem;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 2.5rem;
      font-weight: 500;
    }

    .form-fields-container {
      margin: 2rem;
      padding: 1rem;
      box-sizing: border-box;
      width: 50%;

      .form-field {
        margin-bottom: 1.5rem;
        width: 100%;

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

          animation: BackgroundAnimation 2s ease infinite alternate;

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
              animation: MarginAnimation 1s ease infinite alternate;
            }
            svg {
              font-size: 1.75rem;
            }

            @keyframes MarginAnimation {
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

            animation: BackgroundAnimation 1s ease infinite alternate;
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
        }
      }
    }

    .bottom-links {
      .link {
        margin-bottom: 1rem;

        a {
          text-decoration: none;
          color: #504f4f;
          font-weight: 500;
          transition: 0.25s;
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
