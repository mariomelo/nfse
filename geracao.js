var https = require('https');
var fs = require('fs');
var parse_xml = require('xml2js').parseString;
var htmlescape = require('./helpers/htmlescape');
var xml_writer = require('./helpers/xml_writer');
var SignedXml = require('xml-crypto').SignedXml;


var request_options = {
  hostname: 'bhisshomologa.pbh.gov.br',
  port: 443,
  path: '/bhiss-ws/nfse',
  method: 'POST',
  pfx: fs.readFileSync('6794341.pfx'),
  ca: fs.readFileSync('ca.pem'),
  passphrase: 'armstrong',
  rejectUnauthorized: false,

  headers:{
    "SOAPAction" : "http://ws.bhiss.pbh.gov.br/ConsultarNfse",
    "Content-Type" : "text/xml"
  }
}

/*var req = https.request(request_options, function(res) {

  var response_xml = '';
  res.on('data', function(data) {
    response_xml += data;
  });

  res.on('end', function(){
 
    response_xml = response_xml.substring(response_xml.indexOf('<outputXML>')+11, response_xml.indexOf('</outputXML>'));
    xml_writer.saveXML('consulta', htmlescape.unescape(response_xml));
   
  });
});
*/


function FactaKeyInfo() {
  this.getKeyInfo = function(key) {
    return "<X509Data><X509Certificate>"+ fs.readFileSync("pub.pem").toString() +"</X509Certificate></X509Data>"
  }
  this.getKey = function(keyInfo) {
    //you can use the keyInfo parameter to extract the key in any way you want      
    return fs.readFileSync("pub.pem")
  }
}

function MyTransformation() {

  /*given a node (from the xmldom module) return its canonical representation (as string)*/
  this.process = function(node) {       
    //you should apply your transformation before returning
    return node.toString()
  }

  this.getAlgorithmName = function() {
    return "http://www.w3.org/2000/09/xmldsig#enveloped-signature"
  }
}
SignedXml.CanonicalizationAlgorithms["http://www.w3.org/2000/09/xmldsig#enveloped-signature"] = MyTransformation;

var sig = new SignedXml();
sig.signingKey = fs.readFileSync("priv.pem");
sig.addReference("//*[local-name(.)='InfRps']", ["http://www.w3.org/2000/09/xmldsig#enveloped-signature"]);
sig.keyInfoProvider = new FactaKeyInfo();
sig.computeSignature(fs.readFileSync("templates/rps.xml").toString());
var rps_list_xml = fs.readFileSync("templates/rps_list.xml").toString().replace('{{rps}}', sig.getSignedXml());
sig.computeSignature(rps_list_xml);
fs.writeFileSync("unescaped.xml", sig.getSignedXml());
fs.writeFileSync("signed.xml", htmlescape.escape(sig.getSignedXml()));


//req.write(fs.readFileSync('ex_consulta.xml'));
//req.end();

//req.on('error', function(e) {
//  console.error(e);
//});