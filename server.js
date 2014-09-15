var express = require('express');
var consulta = require('./consulta');
var cancelamento = require('./cancelamento');
var geracao = require('./geracao');
var bodyParser = require('body-parser');
// Authentication module.
var auth = require('http-auth');
var basic = auth.basic({
        realm: "Facta Tecnologia"
    }, function (username, password, callback) { // Custom authentication method.
        callback(username === "yr4p43po89cc" && password === "h7gfs04mb3h40yq");
    }
);


var app = express();
app.use(auth.connect(basic));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());


app.get('/consulta', function(req, res){
  consulta.byData(req.param('startDate'), req.param('endDate'), function(response){
    res.json(response);
  });
});

app.get('/cancela', function(req, res){
  cancelamento.byId(req.param('nfse'), function(response){
    cancelamento.getJSONObject(response, function(json){
      res.json( json );
    });
  });
});

app.post('/gera', function(req, res){
  var dados = JSON.parse(req.body);
  geracao.emite(dados, function(response){
    geracao.getJSONObject(response, function(json){
      res.json( json );
    });
  });
});

var server = app.listen( process.env.PORT || 3000, function() {
    console.log('Aguardando instruções de NFSE na porta %d', server.address().port);
});