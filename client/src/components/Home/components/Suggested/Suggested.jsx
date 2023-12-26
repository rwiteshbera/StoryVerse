import React, { useState } from "react";
import useSWR from "swr/immutable";
import axios from "axios";

import User from "./components/User";
const Suggested = () => {
  let [suggestedAccounts, setSuggestedAccounts] = useState([]);

  const fetcher = (url) =>
    axios
      .get(url)
      .then((response) => {
        setSuggestedAccounts(response.data?.suggestedUsers);

      })
      .catch((e) => {
        navigate("/");
      });

  const { data, error, isLoading } = useSWR("/v1/suggestion/users", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return (
    <section className="mt-4 mx-2 lg:block hidden">
      <p className="text-gray-400">Suggested For You</p>
      {suggestedAccounts &&
        suggestedAccounts.slice(0,5).map((user, key) => {
          return <User data={user} key={key} />;
        })}
    </section>
  );
};

export default Suggested;
