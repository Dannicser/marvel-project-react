import errorImg from "./error.gif";

const ErrorMessage = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img src={errorImg} width="250px" alt="" />
    </div>
  );
};

export default ErrorMessage;
