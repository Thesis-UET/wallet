import { useHistory } from "react-router";
import "./styles.css";
import CardImg1 from "../../assets/images/avax.png";
import CardImg2 from "../../assets/images/ava3.png";

export const CredentialCard = (props) => {
  const { credential, styles} = props;
  const history = useHistory();

  const formatDate = (date) => {
    const originalDate = new Date(date);
    const formattedDate = `${originalDate.getDate()}/${
      originalDate.getMonth() + 1
    }/${originalDate.getFullYear()}`;
    return formattedDate;
  };

  return (
    <div
      className="card"
      style={{
        backgroundImage: `url(${
          credential?.credentialSubject.type === "AccessPass" ? CardImg1 : CardImg2
        })`,
        ...styles
      }}
      onClick={() => {
        history.push(`/credential-detail/${credential?.credentialSubject.id}`);
      }}
    >
      <div className="head">
        <div className="title">AVALUNCH CARD</div>
        <span>{credential?.credentialSubject.type}</span>
      </div>
      <p className="user-name">{credential?.credentialSubject.name}</p>
      <div>
        <div className="footer">
          <div className="date-wrapper">
            <p className="title">START DATE</p>
            <span className="date">{formatDate(credential?.credentialSubject.startDate)}</span>
          </div>
          <div className="date-wrapper">
            <p className="title">END DATE</p>
            <span className="date">{formatDate(credential?.credentialSubject.endDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
