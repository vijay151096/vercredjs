const vcjs = require('@digitalcredentials/vc');
const { RsaSignature2018 } = require('./lib/jsonld-signatures/suites/rsa2018/RsaSignature2018');
const { AssertionProofPurpose } = require('./lib/jsonld-signatures/purposes/AssertionProofPurpose.js');
const { documentLoader} = require("./Utils");


async function verifyCredential(
  verifiableCredential
){
  console.log("\n\n  ************ Verification Initiated ************ \n\n")

  const suiteOptions = {
    verificationMethod: verifiableCredential.proof.verificationMethod,
    date: verifiableCredential.proof.created,
  };

  const purpose = new AssertionProofPurpose();
  const suite  =new RsaSignature2018(suiteOptions);
  const vcjsOptions = {
    purpose,
    suite,
    credential: verifiableCredential,
    documentLoader: await documentLoader,
  };

  const result = await vcjs.verifyCredential(vcjsOptions);

  console.log("\nVerify Credential Response => ", JSON.stringify(result, null, 4));

  console.log("\nVerification Result => ", JSON.stringify(result.verified, null, 4));

  console.log("\n\n  ************ Verification Completed ************ \n\n")


}

module.exports = { verifyCredential };
