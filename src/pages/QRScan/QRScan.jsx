import QrScanner from "qr-scanner";
import { useRef, useState, useEffect } from "react";
import "./style.css";
import axiosInstance from "../../services/http-service";
import { useHistory } from "react-router";
import { dataloader } from "../../dataloader";
import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import { v4 as uuid } from 'uuid';
import { Ed25519Signature2018 } from '@digitalbazaar/ed25519-signature-2018';
import * as vc from '@digitalbazaar/vc';
import * as ecdsaSd2023Cryptosuite from
  '@digitalbazaar/ecdsa-sd-2023-cryptosuite';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import {
  Ed25519VerificationKey2018
} from '@digitalbazaar/ed25519-verification-key-2018';
const {
  createDiscloseCryptosuite,
} = ecdsaSd2023Cryptosuite;

const suite2 = new DataIntegrityProof({
  cryptosuite: createDiscloseCryptosuite({
    // the ID of the base proof to convert to a disclosure proof
    proofId: "urn:uuid:123123123",
    // selectively disclose the entire credential subject; different JSON
    // pointers could be provided to selectively disclose different information;
    // the issuer will have mandatory fields that will be automatically
    // disclosed such as the `issuer` and `issuanceDate` fields
    selectivePointers: [
      '/credentialSubject'
    ]
  })
});

const QRScan = () => {
  const videoRef = useRef(null);
  const [startRecord, setStartRecord] = useState(false);

  const [errorMsg, setErrorMsg] = useState();
  const [qrScanner, setQrScanner] = useState();
  const history = useHistory();

  const handleStartClick = () => {
    const newScanner = new QrScanner(
      videoRef.current,
      async (result) => {
        console.log("decoded qr code:", result);
        const link = result.data;
        if (link !== "https://backend.hocptit.me/v1/issue-credential") {
          setErrorMsg('QR không hợp lệ');
          return
        }
        try {
          newScanner.destroy();
          // const response = await axiosInstance.get(result.data);
          const name = ['Nguyen Van A']
          const response = await axiosInstance.post(
            link,
            {
              holderDid:
                "did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ",
              name: name[Math.floor(Math.random() * name.length)],
            }
          );

          if (response?.status === 200 && response?.data?.success) {
            let { data } = response.data;
            data = JSON.parse(data);
            data = await vc.derive({
              verifiableCredential: data, suite: suite2, documentLoader: dataloader
            });

            const currentSubjects =
              JSON.parse(localStorage.getItem("credentialSubject")) || [];
            const alreadyExists = currentSubjects.some(
              (cre) => cre?.credentialSubject?.name === data?.credentialSubject?.name
            );


            if (!alreadyExists) {
              currentSubjects.push(data);

              localStorage.setItem(
                "credentialSubject",
                JSON.stringify(currentSubjects)
              );
              history.push("/credentials");
            } else {
              setErrorMsg('Chứng chỉ đã tồn tại');
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setErrorMsg('Chứng chỉ không hợp lệ');
        }
        newScanner.destroy();
      },
      {
        /* your options or returnDetailedScanResult: true if you're not specifying any other options */
        highlightCodeOutline: true,
        highlightScanRegion: true,
      }
    );
    setQrScanner(newScanner);
    setStartRecord(true);

    newScanner.start();
  };

  useEffect(() => {
    handleStartClick();
  }, []);

  const handleStopClick = () => {
    if (qrScanner) {
      qrScanner.destroy();
      setStartRecord(false);
    } else {
      alert("scanner not found");
    }
  };
  return (
    <div className="qr-scan-container">
      <p>
        Vui lòng Quét QR code để nhận chứng chỉ
      </p>
      {!startRecord ? (
        <button className="base-button primary-btn" onClick={handleStartClick}>
          Start camera
        </button>
      ) : (
        <button className="base-button delete-btn" onClick={handleStopClick}>
          Stop camera
        </button>
      )}

      <div className="video-container">
        <video className="video-preview" ref={videoRef}></video>
      </div>
      <p className="error-msg">{errorMsg}</p>
    </div>
  );
};

export default QRScan;
