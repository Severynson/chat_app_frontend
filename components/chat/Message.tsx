interface MessageProps {
  _id: string;
  text: string;
  author: {
    _id: string;
    name: string;
  };
  convertedTime: string;
  userId: string;
}

const Message = ({
  _id,
  text,
  author,
  convertedTime,
  userId,
}: MessageProps) => {
  return (
    <>
      {author._id === userId ? (
        <div className="container darker" key={_id}>
          <div className="black-circle">
            <h5>{author.name}</h5>
          </div>
          <p>{text}</p>
          <span className="time">{convertedTime}</span>
        </div>
      ) : (
        <div className="container right" key={_id}>
          <p className="right">{text}</p>
          <div className="black-circle">
            <h5 className="right">{author.name}</h5>
          </div>

          <span className="time">{convertedTime}</span>
        </div>
      )}

      <style jsx>{`
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
      `}</style>
    </>
  );
};

export default Message;
