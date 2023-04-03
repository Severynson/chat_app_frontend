interface InterlocutorHeaderProps {
  interlocutorId: string;
  interlocutorName: string;
}

const InterlocutorHeader = ({ interlocutorId, interlocutorName }: InterlocutorHeaderProps) => {
  return (
    <>
      <div className="black-circle">
        <h5 className="right">{interlocutorName}</h5>
      </div>
      <h3 className="right">#{interlocutorId}</h3>
      <style jsx>{`
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
      `}</style>
    </>
  );
};

export default InterlocutorHeader;
