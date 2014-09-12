var express = require('express');
var consulta = require('./consulta');
var cancelamento = require('./cancelamento');
var app = express();

app.get('/consulta', function(req, res){
  consulta.byData(req.param('startDate'), req.param('endDate'), function(response){
    res.json(response);
  });
});

app.get('/cancela', function(req, res){
  cancelamento.byId(req.param('nfse'), function(response){
    console.log('Primeiro callback!');
    cancelamento.getJSONObject(response, function(json){
      res.json( json );
    });
  });
});

app.get('/gera', function(req, res){
  res.send('Nota fiscal gerada com sucesso!');
});

var server = app.listen( process.env.PORT || 3000, function() {
    console.log('Aguardando instruções de NFSE na porta %d', server.address().port);
});