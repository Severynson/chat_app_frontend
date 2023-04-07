import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import responseErrorsHandler, {
  ResponseError,
} from "@/helpers/responseErrorsHandler";

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

  const openChatWithUser = (chatmateId: string, mateName: string) => {
    push(`/chat/${chatmateId}?interlocutorName=${mateName}`);
  };

  return (
    <>
      <Head>
        <title>Chats</title>
      </Head>
      <>
        <main>
          <h1>Chats with all users:</h1>
          {chats?.map(({ _id, name }) => (
            <div
              className="container darker"
              key={_id}
              onClick={openChatWithUser.bind(null, _id, name)}
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
  const { token } = context.req.cookies;

  console.log("tokenIs: ", token);

  let returnObject;

  try {
    const response = await fetch(
      "http://localhost:8080/user/all-available-chatmates",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data: Chat[] | ResponseError = await response.json();

    if (response.status !== 200) {
      const error = data as ResponseError;
      responseErrorsHandler(error);
    }

    returnObject = {
      props: {
        chats: data,
      },
    };
  } catch (error) {
    console.log(error);

    returnObject = {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return returnObject;
}
