import styled from "styled-components";

const StyledPasswords = styled.div`
  padding: 1rem;

  .alert {
    margin-top: 1.5rem;
    font-size: 1.1rem;

    span {
      display: inline-block;
    }

    span:first-child {
      margin-right: 0.3rem;
    }
  }

  .cards-container {
    .cards {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 1rem;

      @media all and (max-width: 1800px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media all and (max-width: 1300px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media all and (max-width: 1000px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media all and (max-width: 600px) {
        grid-template-columns: repeat(1, 1fr);
      }

      .card {
        box-sizing: border-box;
        padding: 1.5rem;

        background: #eeeeee;

        border-radius: 0.25rem;

        .title {
          text-align: center;
          cursor: default;
          margin-bottom: 1.1rem;

          span {
            display: inline-block;
            font-size: 1.75rem;
          }

          .url {
            svg {
              font-size: 1rem;
              transition: all 0.15s ease-in-out;
            }
          }

          &:hover svg {
            font-size: 1.1rem;
          }
        }

        transition: all 0.2s ease-in-out;

        .field {
          margin-top: 1rem;

          .field-input {
            width: 100%;

            .copy-icon {
              opacity: 0;
              transition: all 0.2s ease-in-out;

              @media all and (orientation: portrait) {
                opacity: 1;
              }

              &:hover {
                transform: scale(1.1);
              }
            }

            &:hover .copy-icon {
              opacity: 1;
            }
          }
        }

        .buttons-wrapper {
          margin-top: 1rem;
          display: flex;
          justify-content: space-between;

          button {
            display: flex;
            padding: 0.3rem 0.7rem;
          }

          .delete-button {
            color: #ff1212;
            border-color: rgba(255, 18, 18, 0.4);

            &:hover {
              background-color: rgba(255, 18, 18, 0.05);
              border-color: #ff1212;
            }
          }

          svg {
            display: inline-block;
            vertical-align: middle;
            font-size: 1rem;
          }

          .edit-text {
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.2rem;
          }
        }
      }

      .card:hover {
        background: #ebebeb;
        box-shadow: 0 0 0.4rem 0 rgba(0, 0, 0, 0.7);
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      margin-top: 0.5rem;
      margin-bottom: 1rem;

      .heading {
        color: #111111;
        font-size: 2.1rem;

        @media all and (max-width: 450px) {
          font-size: 1.75rem;
        }
      }

      .add-button {
        display: flex;
        align-items: center;

        padding: 0.5rem 0.75rem;
        border-radius: 100rem;

        cursor: pointer;
        border: none;

        background: linear-gradient(90deg, #6f00ff, #00ddad);
        background-size: 250% 250%;
        background-position: 100% 52%;
        transition: all 0.3s ease-in-out;

        font-weight: 500;
        color: white;

        &:hover {
          background-position: 0% 49%;
        }

        span {
          margin: 0 0.25rem;
          font-size: 1.05rem;
        }

        span:last-child {
          margin-left: 0;
        }

        @media all and (max-width: 600px) {
          padding: 0.5rem;

          span:last-child {
            display: none;
          }
        }

        @media all and (max-width: 350px) {
          padding: 0.3rem;

          span {
            display: none;
          }
        }
      }
    }
  }
`;

export default StyledPasswords;
