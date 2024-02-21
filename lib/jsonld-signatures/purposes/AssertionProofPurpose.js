/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */

const  { ControllerProofPurpose } = require('./ControllerProofPurpose') ;

class AssertionProofPurpose extends ControllerProofPurpose {
  constructor({
    term = 'assertionMethod', controller,
    date, maxTimestampDelta = Infinity}= {}) {
    super({term, controller, date, maxTimestampDelta});
  }
}

module.exports = {AssertionProofPurpose}
