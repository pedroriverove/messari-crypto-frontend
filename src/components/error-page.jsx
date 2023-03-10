import styled from "@emotion/styled";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
    <Body>
      <Error>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </Error>
    </Body>

    </>

  );
}

const Body = styled.div`
  display: flex;
  height: calc(100vh - 100px);
`

const Error = styled.div`
    align-items: center;
    text-align: center;
    margin: auto
`
