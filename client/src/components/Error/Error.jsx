import React from "react";
import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.log(error)
  return (
    <>
      <div className="text-center flex justify-center items-center h-screen">
        <div>
          <h1 className="text-5xl">Oops!</h1>
          <p className="text-2xl py-4">
            Sorry, an unexpected error has occurred.
          </p>
          <p>{error.status + " " + error.statusText}</p>
        </div>
      </div>
    </>
  );
};

export default Error;
