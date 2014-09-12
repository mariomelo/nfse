var https = require('https');
var fs = require('fs');
var htmlescape = require('./helpers/htmlescape');
var xml_writer = require('./helpers/xml_writer');
var xml2js = require('xml2js');


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
    "SOAPAction" : "http://ws.bhiss.pbh.gov.br/ConsultarNfse",
    "Content-Type" : "text/xml"
  }
}

var getNFSeByData = function(startDate, endDate, callback){
  var req = https.request(request_options, function(res) {

    var response_xml = '';
    res.on('data', function(data) {
      response_xml += data;
    });

    res.on('end', function(){
      response_xml = htmlescape.unescape(response_xml)
      response_xml = response_xml.substring(response_xml.indexOf('<outputXML>')+11, response_xml.indexOf('</outputXML>'));
      getJSONObject(response_xml, callback);
      xml_writer.saveXML('respostas', 'consulta', response_xml);
    });
  });

  req.write(fs.readFileSync('templates/consulta/consulta.xml'));
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}

var getJSONObject = function(response_xml, callback){
  xml2js.parseString(response_xml, function(error, result){
    var json = {};
    json.ativas = [];
    json.canceladas = [];

    var listaNfse = result.ConsultarNfseResposta.ListaNfse[0].CompNfse;
    
    for(var i = 0; i < listaNfse.length; i++){
      var nfse_object = listaNfse[i].Nfse[0].InfNfse[0];
      if(!listaNfse[i].NfseCancelamento)
        json.ativas.push (nfse_object);
      else
        json.canceladas.push (nfse_object);
    }

    json.xml = response_xml;
    callback(JSON.stringify(json));
  });
}

module.exports = {
  byData: function(startDate, endDate, callback){
    return getNFSeByData(startDate, endDate, callback);
  }
}