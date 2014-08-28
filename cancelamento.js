var https = require('https');
var fs = require('fs');
var parse_xml = require('xml2js').parseString;
var xml_writer = require('./helpers/xml_writer');
var SignedXml = require('xml-crypto').SignedXml;
var soap = require('./helpers/soap_message');




function FactaKeyInfo() {
  this.getKeyInfo = function(key) {
    return "<X509Data><X509Certificate>"+ fs.readFileSync("certificados/public.pem").toString() +"</X509Certificate></X509Data>"
  }
  this.getKey = function(keyInfo) {
    //you can use the keyInfo parameter to extract the key in any way you want      
    return fs.readFileSync("certificados/public.pem")
  }
}


var sig = new SignedXml();
sig.keyInfoProvider = new FactaKeyInfo();
sig.signingKey = fs.readFileSync("certificados/private.pem");
sig.addReference("//*[local-name(.)='InfPedidoCancelamento']");
sig.computeSignature(fs.readFileSync("templates/cancelamento/cancelamento.xml").toString());
xml_writer.saveXML('envios', 'cancelamento', soap.get_soap_message('CancelarNfse',sig.getSignedXml()));