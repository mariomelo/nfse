var express = require('express');
var consulta = require('./consulta');
var app = express();

app.get('/consulta', function(req, res){
  consulta.byData(req.param('startDate'), req.param('endDate'), function(response){
    res.json(response);
  });
});

app.get('/cancelamento', function(req, res){
  res.send('Nota fiscal cancelada com sucesso!');
});

app.get('/geracao', function(req, res){
  res.send('Nota fiscal gerada com sucesso!');
});

var server = app.listen(8080, function() {
    console.log('Aguardando instruções de NFSE na porta %d', server.address().port);
});