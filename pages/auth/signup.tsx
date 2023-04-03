import Auth, { AuthFormValues } from "@/components/auth";
import { useRouter } from "next/router";
import { FC, useState } from "react";

const SignUp: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userCreatedSuccessfully, setUserCreatedSuccessfully] =
    useState<boolean>(false);
  const { push } = useRouter();

  const onSubmit = async ({ email, name, password }: AuthFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/auth/signup", {
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
        const errorMessage = (await response.json())?.message || 'Bad status code.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      alert("Some error happened during proces of the user creating! " + error);
      setTimeout(() => {
        push("/auth/login");
      }, 3000);
    }
  };

  return (
    <>
      <div className="container">
        {isLoading && (
          <h1 className="centered">User in proces of creating...</h1>
        )}

        {userCreatedSuccessfully && (
          <h1 className="centered">User has been created successfully!</h1>
        )}

        {!isLoading && !userCreatedSuccessfully && (
          <Auth mode="signup" {...{ onSubmit }} />
        )}
      </div>
      <style jsx>{`
        .container {
          margin-top: 5%;
          display: flex;
          justify-content: center;
        }

        .centered {
          text-align: center;
        }
      `}</style>
    </>
  );
};

export default SignUp;
