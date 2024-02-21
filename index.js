var fs = require('file-system');
var {verifyCredential} = require('./verifyCreds');

const filesRead = fs.readFileSync("vc.json");
const vcJson = JSON.parse(filesRead.toString());

verifyCredential(vcJson);
