import { CredentialCard } from "../../components/CredentialCard";
import "./styles.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTh } from "@fortawesome/free-solid-svg-icons";

const Credentials = () => {

  const credentialSubjects = JSON.parse(localStorage.getItem("credentialSubject")) || [];

  const [isStackingMode, setIsStackingMode] = useState(true);

  return (
    <>
      <div className="mode-buttons">
        <button onClick={()=>setIsStackingMode(true)} className={isStackingMode ? "active" : ""}>
          <FontAwesomeIcon icon={faTh} />
        </button>
        <button onClick={()=>setIsStackingMode(false)} className={!isStackingMode ? "active" : ""}>
          <FontAwesomeIcon icon={faList} />
        </button>
      </div>
      <div className={`card-page ${isStackingMode ? "gap-mode" : "list-mode"}`}>
        {credentialSubjects.length > 0  ? credentialSubjects?.map((credential, index) => {
          return <CredentialCard styles={{top: `${index * 60}px`}} key={index} credential={credential} />;
        }): <p className="no-event">No credential</p>}
      </div>
    </>
  );
};

export default Credentials;
