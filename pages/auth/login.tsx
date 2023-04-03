import Auth, { AuthFormValues } from "@/components/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import Cookies from "universal-cookie";

const Login: FC = () => {
  const cookies = new Cookies();
  const { push } = useRouter();

  const onSubmit = async ({ email, password }: AuthFormValues) => {
    console.log("On submit button pushed");
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("response +++ => ", response);

      if (response.status === 422) {
        throw new Error("Validation failed.");
      }
      if (response.status !== 200 && response.status !== 201) {
        console.log("Error!");
        throw new Error("Could not authenticate you!");
      }

      const responseData = await response.json();

      cookies.remove("token");
      cookies.remove("userId");
      cookies.remove("expiryDate");

      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);

      cookies.set("token", responseData.token);
      cookies.set("userId", responseData.userId);
      cookies.set("expiryDate", expiryDate.toISOString());

      if (
        response.status === 201 &&
        !!responseData.token &&
        !!responseData.userId
      ) {
        push("/");
      }
    } catch (error) {
      alert("Error was ocured! " + error);
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
