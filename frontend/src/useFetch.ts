import { makeRequest } from "./makeRequest";
import { useEffect, useState } from "react";
import { RootState, Store } from "./store";
import { authLogout } from "./reducer/user.reducer";
import { useSelector } from "react-redux";

const DelayRequestTime = <T>(fn: () => Promise<T>, time: number) => {
  return function executated() {
    setTimeout(async () => await fn(), time);
  };
};

export const UseFetch = (url: string) => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Ui.Product[]>();
  const authUser = useSelector((state: RootState) => state.root.auth);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await makeRequest.get(url);
        console.log(response);
        const responseData = await response.data.data;
        setLoading(false);
        setData(responseData);
      } catch (err: any) {
        setError(err);
        console.error(`failed while getting data from server => ${err}`);
        if (err === "You have not access, please login again...") {
          Store.dispatch(authLogout());
        }
      }
    };
    // fetchApiData()
    const delay = DelayRequestTime(fetchApiData, 200);
    delay();
  }, [url, authUser.success]);

  return { error, data, loading };
};
