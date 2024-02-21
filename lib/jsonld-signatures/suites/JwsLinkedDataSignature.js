// Copyright (c) 2020-2021 Digital Bazaar, Inc. All rights reserved.
const { Buffer } = require('buffer');
require('fast-text-encoding');
const jsonld = require('@digitalcredentials/jsonld');
const LinkedDataSignature = require('@digitalcredentials/jsonld-signatures/lib/suites/LinkedDataSignature');
const { encode } = require('base64url-universal');

class JwsLinkedDataSignature extends LinkedDataSignature {
  constructor({
                type,
                alg,
                LDKeyClass,
                verificationMethod,
                signer,
                key,
                proof,
                date,
                useNativeCanonize,
              } = {}) {
    super({ type, verificationMethod, proof, date, useNativeCanonize });
    this.alg = alg;
    this.LDKeyClass = LDKeyClass;
    this.signer = signer;
    if (key) {
      if (verificationMethod === undefined) {
        const publicKey = key.export({ publicKey: true });
        this.verificationMethod = publicKey.id;
      }
      this.key = key;
      if (typeof key.signer === 'function') {
        this.signer = key.signer();
      }
      if (typeof key.verifier === 'function') {
        this.verifier = key.verifier();
      }
    }
  }

  async sign({ verifyData, proof }) {
    if (!(this.signer && typeof this.signer.sign === 'function')) {
      throw new Error('A signer API has not been specified.');
    }

    const header = {
      alg: this.alg,
      b64: false,
      crit: ['b64'],
    };

    const encodedHeader = encode(JSON.stringify(header));
    const data = _createJws({ encodedHeader, verifyData });

    const signature = await this.signer.sign({ data });

    const encodedSignature = encode(signature);
    proof.jws = encodedHeader + '..' + encodedSignature;
    return proof;
  }

  async verifySignature({ verifyData, verificationMethod, proof }) {
    if (
        !(proof.jws && typeof proof.jws === 'string' && proof.jws.includes('.'))
    ) {
      throw new TypeError('The proof does not include a valid "jws" property.');
    }

    const [encodedHeader, , encodedSignature] = proof.jws.split('.');

    let header;
    try {
      header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString());
    } catch (e) {
      throw new Error(`Could not parse JWS header; ${e}`);
    }

    if (!(header && typeof header === 'object')) {
      throw new Error('Invalid JWS header.');
    }

    if (
        !(
            header.alg === this.alg &&
            header.b64 === false &&
            Array.isArray(header.crit) &&
            header.crit.length === 1 &&
            header.crit[0] === 'b64'
        ) &&
        Object.keys(header).length === 3
    ) {
      throw new Error(`Invalid JWS header parameters for ${this.type}.`);
    }

    const signature = Buffer.from(encodedSignature, 'base64');
    const data = _createJws({ encodedHeader, verifyData });

    let { verifier } = this;
    if (!verifier) {
      const key = await this.LDKeyClass.from(verificationMethod);
      verifier = key.verifier();
    }
    return verifier.verify({ data, signature });
  }

  async assertVerificationMethod({ verificationMethod }) {
    if (!jsonld.hasValue(verificationMethod, 'type', this.requiredKeyType)) {
      throw new Error(
          `Invalid key type. Key type must be "${this.requiredKeyType}".`
      );
    }
  }

  async getVerificationMethod({ proof, documentLoader }) {
    if (this.key) {
      return this.key.export({ publicKey: true });
    }

    const verificationMethod = await super.getVerificationMethod({
      proof,
      documentLoader,
    });
    await this.assertVerificationMethod({ verificationMethod });
    return verificationMethod;
  }

  async matchProof({ proof, document, purpose, documentLoader, expansionMap }) {
    if (
        !(await super.matchProof({
          proof,
          document,
          purpose,
          documentLoader,
          expansionMap,
        }))
    ) {
      return false;
    }

    if (!this.key) {
      return true;
    }

    const { verificationMethod } = proof;
    if (typeof verificationMethod === 'object') {
      return verificationMethod.id === this.key.id;
    }
    return verificationMethod === this.key.id;
  }
}

function _createJws({ encodedHeader, verifyData }) {
  const encodedHeaderBytes = new TextEncoder().encode(encodedHeader + '.');

  const data = new Uint8Array(encodedHeaderBytes.length + verifyData.length);
  data.set(encodedHeaderBytes, 0);
  data.set(verifyData, encodedHeaderBytes.length);
  return data;
}

module.exports = { JwsLinkedDataSignature };
