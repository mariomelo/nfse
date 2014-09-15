var fs = require('fs');
var soap = require('./helpers/soap_message');
var soap_sender = require('./helpers/soap_sender');
var xml2js = require('xml2js');

var cancelNFSeByData = function(ambiente_real, nfse_id, callback){
  console.log('Cancelando a nota ' + nfse_id);
  var header = '&lt;CancelarNfseEnvio xmlns=&quot;http://www.abrasf.org.br/nfse.xsd&quot;&gt;';
  var message = fs.readFileSync('templates/cancelamento/cancelamento.xml').toString();
  message = message.replace('{{nfse_id}}', nfse_id);
  var soap_message = soap.get_soap_message('CancelarNfse', message, 'InfPedidoCancelamento').toString();
  var footer = '&lt;/CancelarNfseEnvio&gt;';
  soap_message = soap_message.replace('&lt;Pedido', header+'&lt;Pedido');
  soap_message = soap_message.replace('&lt;/Pedido&gt;', '&lt;/Pedido&gt;'+footer);

  soap_sender.send(ambiente_real, 'CancelarNfse', soap_message, callback);
}

var getJSONObject = function(response_xml, callback){
  xml2js.parseString(response_xml, function(error, result){
    var json = {};
    try{ 
      var listaNfse = result.ConsultarNfseResposta.ListaNfse[0].CompNfse;
      
      for(var i = 0; i < listaNfse.length; i++){
        var nfse_object = listaNfse[i].Nfse[0].InfNfse[0];
        if(!listaNfse[i].NfseCancelamento){
          json.ativas.push (nfse_object);
          json.total_ativas += parseFloat(nfse_object.Servico[0].Valores[0].ValorServicos);
        }
        else{
          json.canceladas.push (nfse_object);
          json.total_canceladas +=  parseFloat(nfse_object.Servico[0].Valores[0].ValorServicos);
        }
      }
    }catch(ex){

    }

    json.xml = response_xml;
    callback( json );
  });
}

module.exports = {
  byId: function(ambiente_real, nfse_id, callback){
    return cancelNFSeByData(ambiente_real, nfse_id, callback);
  },

  getJSONObject: function(xml, callback){
    return getJSONObject(xml, callback);
  }
}