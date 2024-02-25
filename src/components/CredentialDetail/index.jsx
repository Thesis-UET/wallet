import "./styles.css";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../services/http-service";

import QRCode from "qrcode.react";

import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import { Ed25519Signature2018 } from '@digitalbazaar/ed25519-signature-2018';
import * as vc from '@digitalbazaar/vc';
import { dataloader } from "../../dataloader";


export const mockKey2 = {
  type: 'Multikey',
  publicKeyMultibase: 'zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ',
  secretKeyMultibase: 'z42tzVHbFvnJQsor5gCQnakMnuTLioiGGkQAfshgES16Xfmk'
};
const ecdsaKeyPair2 = await EcdsaMultikey.from(mockKey2)
ecdsaKeyPair2.id = `did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ`;
ecdsaKeyPair2.controller = `did:controller:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ`;

const CredentialDetail = (props) => {
  const [credential, setCredential] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shortURL, setSortURL] = useState();

  const credentialSubjects = JSON.parse(localStorage.getItem("credentialSubject")) || [];

  const { id } = useParams();

  const createShortURL = async (credential) => {
    try {

      const verifiableCredential = [
        credential
      ]; // either array or single object
      const id = 'test:ebc6f1c2';
      const holder = 'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ';

      const presentation = vc.createPresentation({
        verifiableCredential, id, holder
      });
      console.log(`presentation`, presentation);
      const challenge = '12ec21'
      console.log(ecdsaKeyPair2.id)
      const suite3 = new Ed25519Signature2018({
        verificationMethod: 'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ',
        key: ecdsaKeyPair2
      });


      const vp = await vc.signPresentation({
        presentation, suite: suite3, challenge, documentLoader: dataloader
      });

      console.log('vp', vp);

      const response = await axiosInstance.post("v1/short-url", {
        data: vp,
      });
      setSortURL(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const currentCredential = credentialSubjects?.find(
      (credential) => credential?.credentialSubject.id === id
    );
    setCredential(currentCredential);
    createShortURL(currentCredential);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function formatDid(did) {
    if (did && typeof did === 'string') {
      const prefixLength = 10;
      const suffixLength = 10;

      const prefix = did.substring(0, prefixLength);
      const suffix = did.slice(-suffixLength);

      return `${prefix}...${suffix}`;
    } else {
      return '';
    }
  }



  return (
    <div className="container ">
      <div>
        <p className="title ">Event Information</p>
        <span onClick={showModal} className="share-icon">
          <FontAwesomeIcon
            icon={faShare}
            style={{ fontSize: "1.5em", color: "#7c7a7a" }}
          />
        </span>
      </div>
      <div>
        <p>ID:</p>
        <p>{formatDid(credential?.credentialSubject.id)}</p>
      </div>
      <div>
        <p>Type:</p>
        <p>{credential?.credentialSubject.type}</p>
      </div>
      <div>
        <p>Event Name:</p>
        <p>{credential?.credentialSubject.eventName}</p>
      </div>
      <div>
        <p>Pass ID:</p>
        <p>{credential?.credentialSubject.passId}</p>
      </div>
      <div>
        <p>Name:</p>
        <p>{credential?.credentialSubject.name}</p>
      </div>
      <div>
        <p>Start Date:</p>
        <p>{credential?.credentialSubject.startDate}</p>
      </div>
      <div>
        <p>End Date:</p>
        <p>{credential?.credentialSubject.endDate}</p>
      </div>
      <div>
        <p>Location</p>
        <p>{credential?.credentialSubject.location}</p>
      </div>
      {isModalOpen && (
        <div className="popup">
          <div className="popup_inner">
            <span onClick={handleCancel}>
              <FontAwesomeIcon
                icon={faTimes}
                style={{ fontSize: "1.5em", color: "#7c7a7a" }}
              />
            </span>
            <p className="title">Chia sẻ chứng chỉ</p>
            <QRCode value={shortURL} className="qr-code" size={200} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialDetail;
