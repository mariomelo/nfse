var fs = require('fs');


module.exports = {
  saveXML: function(type, content){
    writeXML(type, content);
  }
}

var writeXML = function(type, content){
  var filename = 'respostas/' + type + '_' + getDatePrefix() + ".xml";
  fs.writeFile(filename, content, function (err) {
    if (err) throw err;
      console.log('Nota emitida com sucesso!');
  });
}

var getDatePrefix = function(){
  var date = new Date();
  return date.getFullYear().toString() + get2Digits( date.getMonth()+1 ) + get2Digits( date.getDate() ) + '_' + get2Digits( date.getHours() ) + get2Digits( date.getMinutes() ) + get2Digits( date.getSeconds() );
}

var get2Digits = function(number){
  var s = number+"";
  while (s.length < 2) s = "0" + s;
    return s;
}