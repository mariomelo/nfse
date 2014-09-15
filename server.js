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


app.get('/consulta/:ambiente', function(req, res){
  var ambiente_real = req.param('ambiente') == "nfse";
  
  consulta.byData(ambiente_real, req.param('startDate'), req.param('endDate'), function(response){
    res.json(response);
  });
});

app.get('/cancela/:ambiente', function(req, res){
  var ambiente_real = req.param('ambiente') == "nfse";

  cancelamento.byId(ambiente_real, req.param('nfse'), function(response){
    cancelamento.getJSONObject(response, function(json){
      res.json( json );
    });
  });
});

app.post('/gera/:ambiente', function(req, res){
  var ambiente_real = req.param('ambiente') == "nfse";
  var dados = JSON.parse(req.body);

  geracao.emite(ambiente_real, dados, function(response){
    geracao.getJSONObject(response, function(json){
      res.json( json );
    });
  });
});

var server = app.listen( process.env.PORT || 3000, function() {
    console.log('Aguardando instruções de NFSE na porta %d', server.address().port);
});