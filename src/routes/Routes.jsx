import React from "react";
import { Route, Switch } from "react-router";
import CredentialDetail from "../components/CredentialDetail";
import Credentials from "../pages/Credentials/Credentials";
import QRScan from "../pages/QRScan/QRScan";

const Routes= () => {
  return (
    <Switch>
      <Route
      exact
        path="/credentials"
        component={Credentials}
      />
      {/* {/* <Route exact path="/" component={CredentialCard} /> */}
      <Route path="/credential-detail/:id" component={CredentialDetail} /> 

      <Route
      exact
        path="/qr-scan"
        component={QRScan}
      />
     
    </Switch>
  );
};

export default Routes;