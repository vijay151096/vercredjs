const jsonld = require("@digitalcredentials/jsonld");
const ProofType = {
    ED25519: 'Ed25519Signature2018',
    RSA: 'RsaSignature2018',
};

const ProofPurpose = {
    Assertion: 'assertionMethod',
    PublicKey: 'publicKey',
};

const documentLoader = async url => {
    if (url.startsWith('httpsass://')) {
        const response = await fetch(url, "GET");
        const json = await response.json();
        return {
            contextUrl: null,
            documentUrl: url,
            document: json,
        };
    }
    return jsonld.documentLoaders.node()(url);
};


module.exports = {ProofPurpose, ProofType, documentLoader}
