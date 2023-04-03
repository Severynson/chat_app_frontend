import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ChangeEventHandler,
  LegacyRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import openSocket from "socket.io-client";
import * as cookieParser from "cookie";
import Cookies from "universal-cookie";
import Message from "@/components/chat/Message";
import InterlocutorHeader from "@/components/chat/InterlocutorHeader";
import Head from "next/head";

type Message = {
  _id: string;
  author: {
    _id: string;
    name: string;
  };
  text: string;
  createdAt?: string;
};

interface ChatProps {
  initialMessages: Message[];
  myId: string;
}

export default function Chat({ initialMessages, myId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [message, setMessage] = useState("");

  const bottomRef: MutableRefObject<HTMLDivElement | undefined> = useRef();
  const cookies = new Cookies();

  const {
    query: { slug: interlocutorId, interlocutorName },
  } = useRouter();

  const socketIoMessageSubscription = useCallback(
    ({ message, action }: { message: Message; action: string }) => {
      action === "send" && setMessages((prevState) => [...prevState, message]);
    },
    []
  );

  useMemo(() => {
    const socket = openSocket("http://localhost:8080");
    socket.on("messages", socketIoMessageSubscription);
  }, [socketIoMessageSubscription]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const messageHandler: ChangeEventHandler<HTMLTextAreaElement> = async (
    event
  ) => {
    const { value } = event.target;
    setMessage(value);
  };

  const sendMessage = async () => {
    const response = await fetch("http://localhost:8080/chat/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies.get("token"),
      },
      body: JSON.stringify({
        interlocutorId,
        message: {
          text: message,
          author: myId,
        },
      }),
    });

    if (response.status !== 201)
      alert("Some trouble happened while sending your message");
  };

  return (
    <>
      <Head>
        <title>Chat with {interlocutorName}</title>
      </Head>
      <header>
        <InterlocutorHeader
          interlocutorId={interlocutorId as string}
          interlocutorName={interlocutorName as string}
        />
      </header>

      <main>
        {messages?.map(({ author, text, createdAt, _id }) => {
          const time = new Date(createdAt as string);
          const hours = time.getHours();
          const minutes = time.getMinutes();

          const convertedTime = `${hours}:${
            minutes < 9 ? `0${minutes}` : minutes
          }`;

          return (
            <Message
              {...{ author, text, _id, convertedTime, myId }}
              key={_id}
            />
          );
        })}
        <div ref={bottomRef as LegacyRef<HTMLDivElement>} />
      </main>

      <footer className="input-footer">
        <textarea
          onChange={
            messageHandler.bind(null) as ChangeEventHandler<HTMLTextAreaElement>
          }
        ></textarea>
        <button onClick={sendMessage}>
          <Image
            src={"https://cdn-icons-png.flaticon.com/512/6532/6532019.png"}
            height={36}
            width={36}
            alt="send button image"
          />
        </button>
      </footer>

      <style jsx>{`
        header {
          padding: 6px 5%;
          position: fixed;
          left: 0;
          top: 0;
          width: 90%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 24px;
          background-color: #4dabf7;
        }

        main {
          margin-top: 80px;
          margin-bottom: 60px;
        }

        .input-footer {
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100%;
          display: flex;
          height: 50px;
          overflow: hidden;
        }

        .input-footer textarea {
          flex-grow: 1;
          border: none;
          z-index: 1;
        }

        .input-footer button {
          border: none;
          display: block;
          width: 50px;
          height: 100%;
          transition: all 0.3s;
        }

        .input-footer button:hover {
          transform: scale(1.2);
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { cookie } = context.req.headers;
  const { userId: myId, token } = cookieParser.parse(cookie as string);
  const { slug: interlocutorId } = context.query;

  const response = await fetch("http://localhost:8080/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      interlocutorId: interlocutorId,
    }),
  });
  const { messages } = await response.json();

  return {
    props: {
      initialMessages: messages,
      myId,
    },
  };
}
