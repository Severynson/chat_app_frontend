export interface ResponseError {
  message: string;
  data?: Array<{ value: string; msg: string; param: string; location: string }>;
}

const responseErrorsHandler = ({ message, data }: ResponseError) => {
  const errorMessage = data ? data?.map(({ msg }) => msg).join("\n") : message;
  throw new Error(errorMessage)
};

export default responseErrorsHandler;
