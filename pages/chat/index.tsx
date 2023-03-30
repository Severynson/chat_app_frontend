import { useEffect } from "react";
import SocketIO from "socket.io-client";

export default function Chat() {
  useEffect(() => {
    SocketIO("http://localhost:8080");
  }, []);

  return (
    <>
      <h1>Here is the chat page</h1>
    </>
  );
}
