var https = require('https');
var fs = require('fs');
var parse_xml = require('xml2js').parseString;
var htmlescape = require('./helpers/htmlescape');
var xml_writer = require('./helpers/xml_writer');


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

var req = https.request(request_options, function(res) {

  var response_xml = '';
  res.on('data', function(data) {
    response_xml += data;
  });

  res.on('end', function(){
 
    response_xml = response_xml.substring(response_xml.indexOf('<outputXML>')+11, response_xml.indexOf('</outputXML>'));
    xml_writer.saveXML('consulta', htmlescape.unescape(response_xml));
   
  });
});

req.write(fs.readFileSync('ex_consulta.xml'));
req.end();

req.on('error', function(e) {
  console.error(e);
});