import { FC } from "react";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export type AuthFormValues = {
  email: string;
  name?: string;
  password: string;
  passwordConfirm?: string;
};

interface AuthProps {
  mode: "login" | "signup";
  onSubmit: SubmitHandler<AuthFormValues>;
}

const Auth: FC<AuthProps> = ({ mode, onSubmit }): JSX.Element => {
  let validationObject: any = {
    email: yup.string().email().required("Email is required!"),

    password: yup
      .string()
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
        "Password has to contain both of lowercase and uppercase characters, at least 1 digit and symbol"
      )
      .required("Password is required!"),
  };

  if (mode === "signup") {
    validationObject.passwordConfirm = yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Password confirmation is required!");

    validationObject.name = yup.string().min(6).required("name is required!");
  }

  const schema = yup.object().shape(validationObject);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  return (
    <>
      <form className="container" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <p className="input-group_label">Email:</p>
          <input type="email" {...register("email")} />
          {errors.email && <p className="error"> {errors.email.message}</p>}
        </div>

        {mode === "signup" && (
          <div className="input-group">
            <p className="input-group_label">name:</p>
            <input {...register("name")} />
            {errors.name && <p className="error"> {errors.name.message}</p>}
          </div>
        )}

        <div className="input-group">
          <p className="input-group_label">Password:</p>
          <input type="password" {...register("password")} />
          {errors.password && (
            <p className="error"> {errors.password.message}</p>
          )}
        </div>

        {mode === "signup" && (
          <div className="input-group">
            <p className="input-group_label">Confirm password:</p>
            <input type="password" {...register("passwordConfirm")} />
            {errors.passwordConfirm && (
              <p className="error"> {errors.passwordConfirm.message}</p>
            )}
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
      <style jsx>{`
        .container {
          padding: 5px;
          min-width: 300px;
          max-width: 350px;
          display: flex;
          gap: 12px;
          flex-direction: column;
          jusify-content: center;
          align-items: center;
          background-color: #da77f2;
          border-radius: 12px;
        }

        .input-group {
          width: 80%;
        }

        .input-group_label {
          margin: 0 0 3px 0;
        }

        .input-group input {
          width: 100%;
          border-radius: 5px;
        }

        .error {
          border-radius: 5px;
          width: 90%;
          margin-top: 5px;
          margin-left: 12px;
          color: #d6336c;
          background: #ffdeeb;
        }
      `}</style>
    </>
  );
};

export default Auth;
