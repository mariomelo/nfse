var fs = require('fs');
var soap = require('./helpers/soap_message');
var soap_sender = require('./helpers/soap_sender');
var xml2js = require('xml2js');
var htmlescape = require('./helpers/htmlescape');

var getNfseDate = function(){
  var date = new Date();
  return date.getFullYear().toString() + "-" + get2Digits( date.getMonth()+1 ) + "-" + get2Digits( date.getDate() ) + 'T' + get2Digits( date.getHours() ) + ":" + get2Digits( date.getMinutes() ) + ":" + get2Digits( date.getSeconds() );
}

var get2Digits = function(number){
  var s = number+"";
  while (s.length < 2) s = "0" + s;
    return s;
}

var getISSRetido = function(valor_total){
  var imposto_calculado = valor_total * 0.02;
  return Math.round(imposto_calculado * 100) / 100;
}

var preencheDados = function(rps, dados){
  rps = rps.replace('{{rps_id}}', (new Date()).getTime() );
  if(dados.e_cnpj)
    rps = rps.replace(/\{\{cpf_cnpj\}\}/g, 'Cnpj' );
  else
    rps = rps.replace(/\{\{cpf_cnpj\}\}/g, 'Cpf' );

  rps = rps.replace('{{tomador_id}}', dados.tomador_id );
  rps = rps.replace('{{tomador_cep}}', dados.tomador_cep );
  rps = rps.replace('{{tomador_estado}}', dados.tomador_estado );
  rps = rps.replace('{{tomador_municipio}}', dados.tomador_municipio );

  rps = rps.replace('{{tomador_bairro}}', dados.tomador_bairro );
  rps = rps.replace('{{tomador_complemento}}', dados.tomador_complemento );
  rps = rps.replace('{{tomador_numero}}', dados.tomador_numero );
  rps = rps.replace('{{tomador_endereco}}', dados.tomador_endereco );
  rps = rps.replace('{{tomador_nome}}', dados.tomador_nome );

  rps = rps.replace('{{item_lista_servico}}', dados.item_lista_servico );
  rps = rps.replace('{{codigo_tributacao}}', dados.codigo_tributacao );

  rps = rps.replace('{{descricao_servico}}', dados.descricao_servico );
  rps = rps.replace(/\{\{valor_do_servico\}\}/g, dados.valor_do_servico );
  rps = rps.replace('{{serie}}', dados.serie );

  rps = rps.replace('{{data_emissao}}', getNfseDate());
  rps = rps.replace('{{imposto_calculado}}', getISSRetido(dados.valor_do_servico));

  return rps;
}

var emiteNFSE = function(ambiente_real, dados, callback){
  var rps = fs.readFileSync('templates/geracao/rps.xml').toString();
  rps = preencheDados(rps, dados);
  var rps_signature = soap.get_signature_for_element(rps, "InfRps");
  rps = rps.replace('</Rps></ListaRps>', rps_signature+'</Rps></ListaRps>');

  var soap_message = soap.get_soap_message('GerarNfse', rps, "LoteRps");
  soap_sender.send(ambiente_real, 'GerarNfse', soap_message, callback);
}

var getJSONObject = function(response_xml, callback){
  xml2js.parseString(htmlescape.unescape(response_xml), function(error, result){
    var json = {};
    json.result = "Falha ao emitir nota";

    try{
      if(result.GerarNfseResposta.Protocolo[0])
        json.result = "Nota emitida com sucesso";

      json.protocolo = result.GerarNfseResposta.Protocolo[0];
      json.data_recebimento = result.GerarNfseResposta.DataRecebimento[0];
      json.numero_nfse = result.GerarNfseResposta.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0].Numero[0];
    }catch(ex){}

    json.xml = response_xml;
    callback( json );
  });
}

module.exports = {
  emite: function(ambiente_real, dados, callback){
    return emiteNFSE(ambiente_real, dados, callback);
  },

  getJSONObject: function(xml, callback){
    return getJSONObject(xml, callback);
  }
}
