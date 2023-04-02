import { GetServerSidePropsContext, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import * as cookieParser from "cookie";

interface Chat {
  _id: string;
  name: string;
}

interface HomeProps {
  chats: Chat[];
}

export default function Home({ chats }: HomeProps) {
  const { push } = useRouter();

  useEffect(() => {
    const cookies = new Cookies();
    if (!cookies.get("token")) push("/auth/login");
  }, [push]);

  const openChatWithUser = (userId: string) => {
    push(`/chat/${userId}`);
  };

  return (
    <>
      <Head>
        <title>Chats</title>
        {/* <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <main>
          <h1>Chats with all users:</h1>
          {chats?.map(({ _id, name }) => (
            <div
              className="container darker"
              key={_id}
              onClick={openChatWithUser.bind(null, _id)}
            >
              <div>
                <h5>{name}</h5>
              </div>
              <p>{_id}</p>
            </div>
          ))}
        </main>
        <style jsx>{`
          h1 {
            text-align: center;
            margin: 12px 0;
          }

          .chat {
            min-height: 80px;
            width: 100%;
            border-bottom: 1px solid #f2f2f2;
            padding: 12px;
          }

          .container {
            border: 2px solid #dedede;
            background-color: #f1f1f1;
            border-radius: 5px;
            padding: 10px;
            margin: 12px 6px;
            display: flex;
            gap: 46px;
            transition: all 0.3s;
          }

          .container:hover {
            background-color: #f0f0f0;
            cursor: pointer;
          }

          .right {
            justify-content: right;
          }

          .container div {
            background-color: #222;
            height: 64px;
            width: 64px;
            border-radius: 50%;
          }

          .container p {
            font-size: 18px;
          }

          .container div h5 {
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
        `}</style>
      </>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { cookie } = context.req.headers;
  const { userId: myId } = cookieParser.parse(cookie as string);

  const response = await fetch("http://localhost:8080/user/all-users");
  const allUsers: Chat[] = await response.json();

  const usersExceptMe = allUsers.filter((chat) => chat._id !== myId);

  return {
    props: {
      chats: usersExceptMe,
    },
  };
}
