var https = require('https');
var fs = require('fs');
var xml_writer = require('./xml_writer');
var htmlescape = require('./htmlescape');

module.exports = {
  send: function(ambiente_real, method, message, callback){
    send_message(ambiente_real, method, message, callback);
  }
}

var send_message = function(ambiente_real, method, message, callback){
  var request_options = {
    hostname: 'bhisshomologa.pbh.gov.br',
    port: 443,
    path: '/bhiss-ws/nfse',
    method: 'POST',
    ca: fs.readFileSync('certificados/ca.pem'),
    cert: fs.readFileSync('certificados/public_original.pem'),
    key: fs.readFileSync('certificados/private.pem'),
    rejectUnauthorized: false,

    headers:{
      "SOAPAction" : "http://ws.bhiss.pbh.gov.br/" + method,
      "Content-Type" : "text/xml"
    }
  }

  if(ambiente_real)
    request_options.hostname = 'bhissdigital.pbh.gov.br';
  else
    request_options.hostname = 'bhisshomologa.pbh.gov.br';

  var req = https.request(request_options, function(res) {

    var response_xml = '';
    res.on('data', function(data) {
      response_xml += data;
    });

    res.on('end', function(){
      response_xml = response_xml.substring(response_xml.indexOf('<outputXML>')+11, response_xml.indexOf('</outputXML>'));
      callback && callback(response_xml);
      xml_writer.saveXML('respostas', method, htmlescape.unescape(response_xml));
    });
  });

  req.write(message);
  xml_writer.saveXML('envios', method, message);
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}


