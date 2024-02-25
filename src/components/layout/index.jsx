import { Link, useLocation} from "react-router-dom";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faTools, faQrcode } from "@fortawesome/free-solid-svg-icons";  

  const Layout = (props) => {
    const { children } = props;
    const location = useLocation();

  return (
    <div className="layout">
      <div className="content">{children}</div>
      <div>
        <div className="sc-bottom-bar">
          <Link className={`sc-menu-item ${location.pathname === "/credentials" ? "active-menu" : ""}`} to="/credentials">
            <FontAwesomeIcon icon={faIdCard} className="menu-icon"/>
          </Link>
          <Link className={`sc-menu-item ${location.pathname === "/qr-scan" ? "active-menu" : ""}`} to="/qr-scan">
            <FontAwesomeIcon icon={faQrcode} className="menu-icon"/>
          </Link>
          <Link className={`sc-menu-item ${location.pathname === "/develop" ? "active-menu" : ""}`} to="/develop">
            <FontAwesomeIcon icon={faTools} className="menu-icon"/>
          </Link> 
        </div>
      </div>
    </div>
  );  
};

export default Layout;
