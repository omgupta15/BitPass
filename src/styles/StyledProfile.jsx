import styled from "styled-components";

const StyledProfile = styled.div`
  padding: 1rem;

  .buttons-container {
    display: flex;
    flex-wrap: wrap;

    .button {
      color: white;
      margin-top: 1rem;
      margin-right: 1rem;
    }

    .button:last-child {
      margin-right: 0;
    }

    @media all and (max-width: 500px) {
      flex-direction: column;

      .button {
        margin-right: 0;
        margin-top: 1rem;
      }
    }
  }

  .header {
    display: flex;
    flex-direction: column;

    margin-top: 0.5rem;

    .heading {
      color: #111111;
      font-size: 2.1rem;
      margin-right: 0.75rem;

      @media all and (max-width: 450px) {
        font-size: 1.75rem;
      }
    }

    .user-detail {
      display: inline-block;
      padding-top: 0.5rem;
      font-size: 1.25rem;
      color: rgba(0, 0, 0, 0.9);

      .username {
        font-family: monospace;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }

  /* custom colors for material ui buttons */

  .success-button {
    background-color: #43a047;

    &:hover {
      background-color: #1ab322;
    }
  }

  .danger-button {
    background-color: #ff3333;

    &:hover {
      background-color: #ff1212;
    }
  }
`;

export default StyledProfile;
