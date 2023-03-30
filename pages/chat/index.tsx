import { useEffect, useState } from "react";
import openSocket from "socket.io-client";

export default function Chat() {
  const [messages, setMessages] = useState<string>("");

  useEffect(() => {
    const socket = openSocket("http://localhost:8080");

    socket.on("messages", ({ message }: { message: string }) => {
      setMessages(message);
    });
  }, [messages]);

  return (
    <>
      <h1>Here is the messages:</h1>
      <button
        onClick={() => {
          fetch("http://localhost:8080/chat");
        }}
      >
        Click to show it
      </button>
      <p>{messages}</p>
    </>
  );
}
