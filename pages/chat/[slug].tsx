import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ChangeEventHandler,
  LegacyRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import openSocket from "socket.io-client";
import * as cookieParser from "cookie";
import Cookies from "universal-cookie";

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
  const {
    query: { slug: interlocutorId },
  } = useRouter();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [message, setMessage] = useState("");

  const bottomRef: MutableRefObject<HTMLDivElement | undefined> = useRef();

  const cookies = new Cookies();

  useEffect(() => {
    const socketIoMessageSubscription = ({
      message,
      action,
    }: {
      message: Message;
      action: string;
    }) => {
      console.log(message, action);
      if (action === "send") {
        setMessages((prevState) => {
          console.log(message._id);
          console.log(prevState.map(({ _id }) => _id));
          if (prevState.map(({ _id }) => _id).includes(message._id)) {
            return prevState;
          } else return [...prevState, message];
        });

        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    const socket = openSocket("http://localhost:8080");
    socket.on("messages", socketIoMessageSubscription);
    return () => {
      socket.off("message", socketIoMessageSubscription);
    };
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
          // time: new Date().toISOString(),
        },
      }),
    });

    console.log(response.status);
  };

  return (
    <>
      <header>
        <div className="black-circle">
          <h5 className="right">Name 1</h5>
        </div>
        <h3 className="right">#{interlocutorId}</h3>
      </header>

      <main>
        {messages?.map(({ author, text, createdAt, _id }) => {
          const time = new Date(createdAt as string);
          const hours = time.getHours();
          const minutes = time.getMinutes();

          if (author._id === myId) {
            return (
              <div className="container darker" key={_id}>
                <div className="black-circle">
                  <h5>{author.name}</h5>
                </div>
                <p>{text}</p>
                <span className="time">
                  {hours}:{minutes < 9 ? `0${minutes}` : minutes}
                </span>
              </div>
            );
          } else {
            return (
              <div className="container right" key={_id}>
                <p className="right">{text}</p>
                <div className="black-circle">
                  <h5 className="right">{author.name}</h5>
                </div>

                <span className="time">{createdAt}</span>
              </div>
            );
          }
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
            alt=""
            className="image"
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

        .container {
          border: 2px solid #dedede;
          background-color: #f1f1f1;
          border-radius: 5px;
          padding: 10px;
          margin: 10px 0;
          display: flex;
          gap: 12px;
        }

        .right {
          justify-content: right;
        }

        .black-circle {
          background-color: #222;
          height: 64px;
          width: 64px;
          border-radius: 50%;
        }

        .black-circle h5 {
          color: #f9f9f9;
          text-align: center;
        }

        .darker {
          border-color: #ccc;
          background-color: #ddd;
        }

        .time {
          color: #aaa;
          align-self: end;
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
