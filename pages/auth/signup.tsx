import Auth, { AuthFormValues } from "@/components/auth";
import { useRouter } from "next/router";
import { FC, useState } from "react";

const SignUp: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userCreatedSuccessfully, setUserCreatedSuccessfully] =
    useState<boolean>(false);
  const { push } = useRouter();

  const onSubmit = async ({ email, name, password }: AuthFormValues) => {
    setIsLoading(true);
    const response = await fetch("http://localhost:8080/chat", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password }),
    });

    response && setIsLoading(false);

    if (response.status === 201) {
      setUserCreatedSuccessfully(true);
      setTimeout(() => {
        push("/auth/login");
      }, 3000);
    } else {
      alert(
        `Response status - ${response.status}. Some error happened during proces of the user creating!`
      );
    }
  };

  return (
    <>
      <div className="container">
        {isLoading && (
          <h1 style={{ textAlign: "center" }}>User in proces of creating...</h1>
        )}

        {userCreatedSuccessfully && (
          <h1 style={{ textAlign: "center" }}>
            User has been created successfully!
          </h1>
        )}

        {!isLoading && <Auth mode="signup" {...{ onSubmit }} />}
      </div>
      <style jsx>{`
        .container {
          margin-top: 5%;
          width: 100%;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default SignUp;
