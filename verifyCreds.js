const vcjs = require('@digitalcredentials/vc');
const { RsaSignature2018 } = require('./lib/jsonld-signatures/suites/rsa2018/RsaSignature2018');
const { AssertionProofPurpose } = require('./lib/jsonld-signatures/purposes/AssertionProofPurpose.js');
const jsonld = require('@digitalcredentials/jsonld');

const ProofType = {
  ED25519: 'Ed25519Signature2018',
  RSA: 'RsaSignature2018',
};

const ProofPurpose = {
  Assertion: 'assertionMethod',
  PublicKey: 'publicKey',
};

async function verifyCredential(
  verifiableCredential
){
  console.log("\n\n  ************ Verification Initiated ************ \n\n")
  let purpose;
  switch (verifiableCredential.proof.proofPurpose) {
    case ProofPurpose.Assertion:
      purpose = new AssertionProofPurpose();
      break;
  }

  let suite;
  const suiteOptions = {
    verificationMethod: verifiableCredential.proof.verificationMethod,
    date: verifiableCredential.proof.created,
  };
  switch (verifiableCredential.proof.type) {
    case ProofType.RSA: {
      suite = new RsaSignature2018(suiteOptions);
      break;
    }
  }

  const vcjsOptions = {
    purpose,
    suite,
    credential: verifiableCredential,
    documentLoader: jsonld.documentLoaders.node(),
  };

  const result = await vcjs.verifyCredential(vcjsOptions);

  console.log("\nVerify Credential Response => ", JSON.stringify(result, null, 4));

  console.log("\n\n  ************ Verification Completed ************ \n\n")


}

module.exports = { verifyCredential };
