import { Socket, io } from "socket.io-client";
import Cookie from "js-cookie";
import React from "react";

export const useSocket = (isLoggedIn: boolean) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [socket, setSocket] = React.useState<Socket | null>(null);
 console.log(socket)
  React.useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      const token = Cookie.get("accessToken");

      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
        path: "/socket.io",
      });
      setSocket(newSocket);
      setLoading(false);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isLoggedIn]);

  return { socket, loading };
};
