var fs = require('fs');
var soap = require('./helpers/soap_message');
var soap_sender = require('./helpers/soap_sender');

var header = '&lt;CancelarNfseEnvio xmlns=&quot;http://www.abrasf.org.br/nfse.xsd&quot;&gt;';
var soap_message = soap.get_soap_message('CancelarNfse', fs.readFileSync('templates/cancelamento/cancelamento.xml'), 'InfPedidoCancelamento').toString();
var footer = '&lt;/CancelarNfseEnvio&gt;';
soap_message = soap_message.replace('&lt;Pedido', header+'&lt;Pedido');
soap_message = soap_message.replace('&lt;/Pedido&gt;', '&lt;/Pedido&gt;'+footer);

soap_sender.send('CancelarNfse', soap_message);