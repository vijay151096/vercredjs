// Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.

// Importing the necessary classes
const { RsaVerificationKey2018 } = require('@digitalbazaar/rsa-verification-key-2018/lib/RsaVerificationKey2018');
const { JwsLinkedDataSignature } = require('../JwsLinkedDataSignature');

// Defining the RsaSignature2018 interface
const RsaSignature2018 = class extends JwsLinkedDataSignature {
  /**
   * @param type {string} Provided by subclass.
   *
   * One of these parameters is required to use a suite for signing:
   *
   * @param [creator] {string} A key id URL to the paired public key.
   * @param [verificationMethod] {string} A key id URL to the paired public key.
   *
   * This parameter is required for signing:
   *
   * @param [signer] {function} an optional signer.
   *
   * Advanced optional parameters and overrides:
   *
   * @param [proof] {object} a JSON-LD document with options to use for
   *   the `proof` node (e.g. any other custom fields can be provided here
   *   using a context different from security-v2).
   * @param [date] {string|Date} signing date to use if not passed.
   * @param [key] {LDKeyPair} an optional crypto-ld KeyPair.
   * @param [useNativeCanonize] {boolean} true to use a native canonize
   *   algorithm.
   */
  constructor({
                signer,
                key,
                verificationMethod,
                proof,
                date,
                useNativeCanonize,
              } = {}) {
    super({
      type: 'RsaSignature2018',
      alg: 'PS256',
      LDKeyClass: RsaVerificationKey2018,
      verificationMethod,
      signer,
      key,
      proof,
      date,
      useNativeCanonize,
    });
    this.requiredKeyType = 'RsaVerificationKey2018';
  }
};

module.exports = { RsaSignature2018 };
