import { GetServerSidePropsContext, NextPageContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ChangeEventHandler,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from "react";
import openSocket from "socket.io-client";
import Cookies from "universal-cookie";
import * as cookieParser from "cookie";

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

  console.log(messages);
  // useEffect(() => {
  //   const socket = openSocket("http://localhost:8080");

  //   socket.on("messages", ({ message }: { message: string }) => {
  //     setMessages(message);
  //   });
  // }, [messages]);

  // useEffect(() => {
  //   const cookies = new Cookies();

  //   if (!!cookies.get("userId") && !!interlocutorId)
  //     fetch("http://localhost:8080/chat", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: cookies.get("userId"),
  //         interlocutorId: interlocutorId,
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((resData) => {
  //         setMessages(resData.messages);
  //       });
  // }, [interlocutorId]);

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
      },
      body: JSON.stringify({
        interlocutorId,
        userId: myId,
        message: {
          text: message,
          author: myId,
          time: new Date().toISOString(),
        },
      }),
    });

    console.log(response.body);
  };

  return (
    <>
      {/* <h1>Chat with: </h1>
      <button
        onClick={() => {
          fetch("http://localhost:8080/chat");
        }}
      >
        Click to show it! {interlocutorId}
      </button>
      <p>{messages}</p> */}

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
            <div className="container right" key={_id}>
              <div className="black-circle">
                <h5 className="right">{author.name}</h5>
              </div>
              <p className="right">{text}</p>
              <span className="time">{createdAt}</span>
            </div>;
          }
        })}
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
  const { userId: myId } = cookieParser.parse(cookie as string);
  const { slug: interlocutorId } = context.query;

  // const response = await fetch("http://localhost:8080/user/all-users");
  // const allUsers: Chat[] = await response.json();

  const response = await fetch("http://localhost:8080/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: myId,
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
