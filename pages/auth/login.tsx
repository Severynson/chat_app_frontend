import Auth, { AuthFormValues } from "@/components/auth";
import responseErrorsHandler from "@/helpers/responseErrorsHandler";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import Cookies from "universal-cookie";

const Login: FC = () => {
  const cookies = new Cookies();
  const { push } = useRouter();

  const onSubmit = async ({ email, password }: AuthFormValues) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (response.status === 201) {
        cookies.remove("token");
        cookies.remove("userId");
        cookies.remove("expiryDate");

        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );

        cookies.set("token", responseData.token);
        cookies.set("userId", responseData.userId);
        cookies.set("expiryDate", expiryDate.toISOString());

        push("/");
      } else {
        const error = responseData;
        responseErrorsHandler(error);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="container">
        <Auth mode="login" {...{ onSubmit }} />
        <h4>
          Don&apos;t have the account yet?{" "}
          <Link href="/auth/signup">Create now!</Link>
        </h4>
      </div>
      <style jsx>{`
        .container {
          margin-top: 5%;
          width: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
        }
      `}</style>
    </>
  );
};

export default Login;
