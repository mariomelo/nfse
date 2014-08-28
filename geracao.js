var fs = require('fs');
var soap = require('./helpers/soap_message');
var soap_sender = require('./helpers/soap_sender');

var rps = fs.readFileSync('templates/geracao/rps.xml').toString();
rps = rps.replace('{{rps_id}}', (new Date()).getTime() );
var rps_signature = soap.get_signature_for_element(rps, "InfRps");
rps = rps.replace('</Rps></ListaRps>', rps_signature+'</Rps></ListaRps>');

var soap_message = soap.get_soap_message('GerarNfse', rps, "LoteRps");
soap_sender.send('GerarNfse', soap_message);
