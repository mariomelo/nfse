var fs = require('fs');
var htmlescape = require('./htmlescape');
var SignedXml = require('xml-crypto').SignedXml;

module.exports = {
  get_soap_message: function(method, body, reference){
    return get_soap_message(method, body, reference);
  },

  get_signature_for_element: function(message, reference){
    return getSignatureForElement(message, reference);
  }
}

function FactaKeyInfo() {
  this.getKeyInfo = function(key) {
    return "<X509Data><X509Certificate>"+ fs.readFileSync("./certificados/public.pem").toString() +"</X509Certificate></X509Data>"
  }
  this.getKey = function(keyInfo) {
    //you can use the keyInfo parameter to extract the key in any way you want      
    return fs.readFileSync("./certificados/public.pem")
  }
}


var getSignatureForElement = function(message, reference){
  var sig = new SignedXml();
  sig.keyInfoProvider = new FactaKeyInfo();
  sig.signingKey = fs.readFileSync("certificados/private.pem");
  sig.addReference("//*[local-name(.)='"+reference+"']");
  sig.computeSignature(message.toString());
  return sig.getSignatureXml();
}

var getSignedMessage = function(message, reference){
  var sig = new SignedXml();
  sig.keyInfoProvider = new FactaKeyInfo();
  sig.signingKey = fs.readFileSync("certificados/private.pem");
  sig.addReference("//*[local-name(.)='"+reference+"']");
  sig.computeSignature(message.toString());
  return sig.getSignedXml();
}


var get_soap_message = function(method, body, reference){
  var soap_message = fs.readFileSync('./templates/soap_header.xml').toString();
  var signedBody = getSignedMessage(body, reference);

  soap_message = soap_message.replace(/\{\{metodo\}\}/g, method);
  soap_message = soap_message.replace(/\{\{dados\}\}/g, htmlescape.escape(signedBody));

  return soap_message;
}