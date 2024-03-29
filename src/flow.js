import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import {v4 as uuid} from 'uuid';
import {Ed25519Signature2018} from '@digitalbazaar/ed25519-signature-2018';
import * as vc from '@digitalbazaar/vc';
import * as ecdsaSd2023Cryptosuite from
        '@digitalbazaar/ecdsa-sd-2023-cryptosuite';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import {
    Ed25519VerificationKey2018
} from '@digitalbazaar/ed25519-verification-key-2018';
const {createSignCryptosuite} = ecdsaSd2023Cryptosuite;
import jsigs from 'jsonld-signatures';
const remoteDocuments = new Map();
import jsonld from 'jsonld';
import {dataloader} from "./dataloader.js";
import {credential} from "./credential.js";
export const mockKey = {
    type: 'Multikey',
    publicKeyMultibase: 'zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw',
    secretKeyMultibase: 'z42twirSb1PULt5Sg6gjgNMsdiLycu6fbA83aX1vVb8e3ncP'
};
const ecdsaKeyPair1 = await EcdsaMultikey.from(mockKey)
console.log(ecdsaKeyPair1.export({publicKey: true}));
ecdsaKeyPair1.id = `did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw`;
ecdsaKeyPair1.controller = `controller:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw`;

console.log(await ecdsaKeyPair1.export({publicKey: true}));

export const mockKey2 = {
    type: 'Multikey',
    publicKeyMultibase: 'zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ',
    secretKeyMultibase: 'z42tzVHbFvnJQsor5gCQnakMnuTLioiGGkQAfshgES16Xfmk'
};
const ecdsaKeyPair2 = await EcdsaMultikey.from(mockKey2)
ecdsaKeyPair2.id = `did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ`;
ecdsaKeyPair2.controller = `did:controller:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ`;
console.log(await ecdsaKeyPair2.export({publicKey: true}));

// setup ecdsa-sd-2023 suite for signing selective disclosure VCs
const suite1 = new DataIntegrityProof({
    signer: ecdsaKeyPair1.signer(),
    cryptosuite: createSignCryptosuite({
        // require the `issuer` and `issuanceDate` fields to always be disclosed
        // by the holder (presenter)
        mandatoryPointers: [
            '/issuanceDate',
            '/issuer'
        ]
    })
});
// use a proof ID to enable it to be found and transformed into a disclosure
// proof by the holder later
const proofId1 = `urn:uuid:${uuid()}`;
console.log('proofId', proofId1);
suite1.proof = {id: proofId1};

const signedVC = await vc.issue({credential, suite: suite1, documentLoader: dataloader});
console.log(JSON.stringify(signedVC, null, 2));
console.log('------------------------------------');



// ------------------------------




const {
    createDiscloseCryptosuite,
} = ecdsaSd2023Cryptosuite;

// sample signed credential



// note no `signer` needed; the selective disclosure credential will be
// derived from the base proof already provided by the issuer
const suite2 = new DataIntegrityProof({
    cryptosuite: createDiscloseCryptosuite({
        // the ID of the base proof to convert to a disclosure proof
        proofId: proofId1,
        // selectively disclose the entire credential subject; different JSON
        // pointers could be provided to selectively disclose different information;
        // the issuer will have mandatory fields that will be automatically
        // disclosed such as the `issuer` and `issuanceDate` fields
        selectivePointers: [
            '/credentialSubject'
        ]
    })
});

const derivedVC = await vc.derive({
    verifiableCredential: signedVC, suite: suite2, documentLoader: dataloader
});
console.log(JSON.stringify(derivedVC, null, 2));

console.log('------------------------------------');


// ------------------------------


const verifiableCredential = [
    derivedVC
]; // either array or single object
const id = 'test:ebc6f1c2';
const holder = 'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ';

const presentation = vc.createPresentation({
    verifiableCredential, id, holder
});

console.log(JSON.stringify(presentation, null, 2));
console.log('------------------------------------');

// ------------------------------

const challenge = '12ec21'
console.log(ecdsaKeyPair2.id)
const suite3 = new Ed25519Signature2018({
    verificationMethod: 'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ',
    key: ecdsaKeyPair2
});


const vp = await vc.signPresentation({
    presentation, suite: suite3, challenge, documentLoader: dataloader
});

console.log(JSON.stringify(vp, null, 2));

console.log('------------------------------------');

// ------------------------------

const res = await vc.verify({
    presentation: vp, suite: suite3, documentLoader: dataloader, challenge
});

console.log(res.error);
