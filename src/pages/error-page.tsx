import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let errorMsg = "Unknown error message";

  if (isRouteErrorResponse(error)) {
    errorMsg = error.statusText;
  } else if (error instanceof Error) {
    errorMsg = error.message;
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMsg}</i>
      </p>
    </div>
  );
}
